import React, { useEffect, useState } from "react";
import { Modal, Select, Row, Col, Typography, message } from "antd";
import {
  HomeOutlined,
  ApartmentOutlined,
  ToolOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getBedsByWardId,
  editBedStatus,
  getAllWards,
} from "../Redux/Slices/IpdSlice";

const { Option } = Select;
const { Text } = Typography;

const AssignBedModal = ({ visible, onClose, onAssign, patientId }) => {
  const dispatch = useDispatch();
  const { wards, beds } = useSelector((state) => state.ipd);

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedWardType, setSelectedWardType] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setSelectedBuilding(null);
    setSelectedFloor(null);
    setSelectedWardType(null);
    setSelectedWard(null);
    setSelectedBed(null);
  };

  useEffect(() => {
    if (visible) {
      dispatch(getAllWards());
      reset();
    }
  }, [visible, dispatch]);

  useEffect(() => {
    if (selectedWard) {
      dispatch(getBedsByWardId(selectedWard));
      setSelectedBed(null);
    }
  }, [selectedWard, dispatch]);

  const buildings = [...new Set(wards.map((w) => w.building))];
  const floors = [...new Set(wards.filter((w) => w.building === selectedBuilding).map((w) => w.floor))];
  const wardTypes = [...new Set(
    wards
      .filter((w) => w.building === selectedBuilding && w.floor === selectedFloor)
      .map((w) => w.ward_type)
  )];
  const filteredWards = wards.filter(
    (w) =>
      w.building === selectedBuilding &&
      w.floor === selectedFloor &&
      w.ward_type === selectedWardType
  );

  // Auto-select floor
  useEffect(() => {
    if (selectedBuilding && floors.length === 1) {
      setSelectedFloor(floors[0]);
    }
  }, [selectedBuilding, floors]);

  // Auto-select ward type
  useEffect(() => {
    if (selectedFloor && wardTypes.length === 1) {
      setSelectedWardType(wardTypes[0]);
    }
  }, [selectedFloor, wardTypes]);

  // Auto-select ward
  useEffect(() => {
    if (selectedWardType && filteredWards.length === 1) {
      setSelectedWard(filteredWards[0].id);
    }
  }, [selectedWardType, filteredWards]);

  // Optional: auto-select only free bed
  useEffect(() => {
    if (selectedWard) {
      const availableBeds = beds.filter((b) => !b.is_occupied);
      if (availableBeds.length === 1) {
        setSelectedBed(availableBeds[0].id);
      }
    }
  }, [beds, selectedWard]);

  const handleAssign = async () => {
    const ward = wards.find((w) => w.id === selectedWard);
    const bed = beds.find((b) => b.id === selectedBed);

    if (!bed || !ward || !patientId) {
      message.error("Missing data for assignment.");
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(
        editBedStatus({
          bedId: bed.id,
          data: { is_occupied: true, patient: patientId },
        })
      );
      onAssign?.({
        building: ward.building,
        floor: ward.floor,
        ward: ward.ward_name,
        bed: bed.bed_no,
      });
      message.success(`Bed ${bed.bed_no} assigned successfully.`);
      onClose();
      reset();
    } catch (err) {
      message.error("Failed to assign bed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Assign Bed"
      open={visible}
      onCancel={() => {
        onClose();
        reset();
      }}
      confirmLoading={isLoading}
      onOk={handleAssign}
    >
      <div style={{ marginBottom: 16 }}>
        <Text strong>Select Building</Text>
        <Select
          style={{ width: "100%" }}
          value={selectedBuilding}
          placeholder="Building"
          onChange={(val) => {
            setSelectedBuilding(val);
            setSelectedFloor(null);
            setSelectedWardType(null);
            setSelectedWard(null);
            setSelectedBed(null);
          }}
        >
          {buildings.map((b) => (
            <Option key={b} value={b}>
              <HomeOutlined /> {b}
            </Option>
          ))}
        </Select>
      </div>

      {selectedBuilding && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Select Floor</Text>
          <Select
            style={{ width: "100%" }}
            value={selectedFloor}
            placeholder="Floor"
            onChange={(val) => {
              setSelectedFloor(val);
              setSelectedWardType(null);
              setSelectedWard(null);
              setSelectedBed(null);
            }}
          >
            {floors.map((f) => (
              <Option key={f} value={f}>
                <ApartmentOutlined /> Floor {f}
              </Option>
            ))}
          </Select>
        </div>
      )}

      {selectedFloor && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Select Ward Type</Text>
          <Select
            style={{ width: "100%" }}
            value={selectedWardType}
            placeholder="Ward Type"
            onChange={(val) => {
              setSelectedWardType(val);
              setSelectedWard(null);
              setSelectedBed(null);
            }}
          >
            {wardTypes.map((type) => (
              <Option key={type} value={type}>
                <ToolOutlined /> {type}
              </Option>
            ))}
          </Select>
        </div>
      )}

      {selectedWardType && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Select Ward</Text>
          <Select
            style={{ width: "100%" }}
            value={selectedWard}
            placeholder="Ward"
            onChange={(val) => {
              setSelectedWard(val);
              setSelectedBed(null);
            }}
          >
            {filteredWards.map((ward) => (
              <Option key={ward.id} value={ward.id}>
                <BuildOutlined /> {ward.ward_name} – Floor {ward.floor}
              </Option>
            ))}
          </Select>
        </div>
      )}

      {selectedWard && beds?.length > 0 && (
        <>
          <Text strong>Select Bed</Text>
          <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
            {beds.map((bed) => (
              <Col key={bed.id}>
                <div
                  onClick={() => !bed.is_occupied && setSelectedBed(bed.id)}
                  style={{
                    width: 60,
                    height: 40,
                    backgroundColor:
                      selectedBed === bed.id
                        ? "#1890ff"
                        : bed.is_occupied
                          ? "#ffccc7"
                          : "#d9f7be",
                    color: bed.is_occupied
                      ? "#a8071a"
                      : selectedBed === bed.id
                      ? "#fff"
                      : "#389e0d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 6,
                    cursor: bed.is_occupied ? "not-allowed" : "pointer",
                    border: "1px solid #ccc",
                  }}
                >
                  🛏 {bed.bed_no}
                </div>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Modal>
  );
};

export default AssignBedModal;
