import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Space, Divider, Select } from "antd";
import {
  postWard,
  postBed,
  getWardsWithBeds
} from "../Redux/Slices/IpdSlice";
import AddWardModal from "../Modals/AddWardModal";
import AddBedModal from "../Modals/AddBedModal";
import {
  PlusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const BedStatus = () => {
  const dispatch = useDispatch();
  const { wardsBeds = [], loading } = useSelector((state) => state.ipd);

  const [wardModalOpen, setWardModalOpen] = useState(false);
  const [bedModalOpen, setBedModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedWardType, setSelectedWardType] = useState(null);
  const user = JSON.parse(localStorage.getItem("HMS-user"));
  const isAdmin = user?.designation?.toLowerCase() === "admin";

  useEffect(() => {
    dispatch(getWardsWithBeds());
  }, [dispatch]);

  const handleAddWard = (values) => {
    dispatch(postWard(values)).then((res) => {
      if (!res.error) {
        dispatch(getWardsWithBeds());
        setWardModalOpen(false);
      }
    });
  };

  const handleAddBed = (values) => {
    dispatch(postBed(values)).then((res) => {
      if (!res.error) {
        dispatch(getWardsWithBeds());
        setBedModalOpen(false);
      }
    });
  };

  // Independent filter option extraction
  const buildings = [...new Set(wardsBeds.map((w) => w.building))];
  const floors = [...new Set(wardsBeds.map((w) => w.floor))];
  const wardTypes = [...new Set(wardsBeds.map((w) => w.ward_type))];

  // Independent filtering logic
  const filteredWards = wardsBeds.filter((w) =>
    (!selectedBuilding || w.building === selectedBuilding) &&
    (!selectedFloor || w.floor === selectedFloor) &&
    (!selectedWardType || w.ward_type === selectedWardType)
  );

  return (
    <div style={{ padding: 24 }}>
      {/* Filters */}
      <div
        style={{
          background: "#f5f5f5",
          padding: 16,
          marginBottom: 24,
          borderRadius: 8,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <Select
          placeholder="Filter by Building"
          allowClear
          style={{ width: 200 }}
          value={selectedBuilding}
          onChange={(val) => setSelectedBuilding(val)}
        >
          {buildings.map((b) => (
            <Option key={b} value={b}>
              {b}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Filter by Floor"
          allowClear
          style={{ width: 200 }}
          value={selectedFloor}
          onChange={(val) => setSelectedFloor(val)}
        >
          {floors.map((f) => (
            <Option key={f} value={f}>
              Floor {f}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Filter by Ward Type"
          allowClear
          style={{ width: 200 }}
          value={selectedWardType}
          onChange={(val) => setSelectedWardType(val)}
        >
          {wardTypes.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>

        <Button
          onClick={() => {
            setSelectedBuilding(null);
            setSelectedFloor(null);
            setSelectedWardType(null);
          }}
        >
          Reset Filters
        </Button>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Manage Wards & Beds</Title>
        {isAdmin && (
          <Space>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => setWardModalOpen(true)}
            >
              Add Ward
            </Button>
            <Button icon={<PlusCircleOutlined />} onClick={() => setBedModalOpen(true)}>
              Add Bed
            </Button>
          </Space>
        )}
      </div>
      <Divider />

      {/* Wards and Beds Display */}
      {filteredWards.length === 0 ? (
        <Title level={5} style={{ color: "#999" }}>No wards or beds available.</Title>
      ) : (
        filteredWards.map((ward) => (
          <div key={ward.id} style={{ marginBottom: 32 }}>
            <Title level={4} style={{ color: "#1890ff" }}>
              {ward.ward_name}
            </Title>

            {ward.beds.length === 0 ? (
              <p style={{ color: "#999" }}>No beds in this ward.</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 16,
                }}
              >
                {ward.beds.map((bed) => (
                  <div
                    key={bed.id}
                    style={{
                      borderRadius: 8,
                      background: bed.is_occupied ? "#ffeaea" : "#eaffea", // red or green background
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                      border: "1px solid #d9d9d9",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: 100,
                      width: 100
                    }}
                  >
                    <div style={{ textAlign: "center", padding: 12 }}>
                      <img
                        src="/bed-icon.jpg"
                        alt="Bed Icon"
                        style={{ width: 50, height: 50, objectFit: "contain" }}
                      />
                    </div>
                    <div style={{ height: 2, width: "100%", backgroundColor: "#1890ff" }} />
                    <div style={{ background: "#f6faff", padding: 1, textAlign: "center" }}>
                      <Title style={{ margin: "4px 0", fontSize: 12 }}>
                        {bed.bed_no}
                      </Title>
                      <p style={{ margin: 0, fontSize: 13 }}>
                        <strong>Bed-Type:</strong> {bed.bed_type}
                      </p>
                      {bed.description && (
                        <p style={{ margin: 0, fontSize: 13 }}>
                          <strong>Note:</strong> {bed.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      {/* Modals */}
      <AddWardModal
        open={wardModalOpen}
        onClose={() => setWardModalOpen(false)}
        onSubmit={handleAddWard}
        loading={loading}
        wards={wardsBeds}
      />
      <AddBedModal
        open={bedModalOpen}
        onClose={() => setBedModalOpen(false)}
        onSubmit={handleAddBed}
        loading={loading}
        wards={wardsBeds}
      />
    </div>
  );
};

export default BedStatus;
