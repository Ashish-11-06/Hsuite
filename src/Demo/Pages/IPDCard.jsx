import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // ✅ Import dispatch
import { Card, Select, Tag, Typography, Button, message } from "antd";
import dayjs from "dayjs";
import AssignBedModal from "../Modals/AssignBedModal";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import { fetchAllIPD, transferDoctor } from "../Redux/Slices/IpdSlice";

const { Text } = Typography;
const { Option } = Select;

const IPDCard = ({ item }) => {
  const dispatch = useDispatch(); // ✅ Needed for transferDoctor
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [assignedBedDetails, setAssignedBedDetails] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(false); // ✅ Toggle for dropdown

  const [doctors, setDoctors] = useState([]);

useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const response = await dispatch(GetAllUsers()).unwrap();
      const doctorList = Array.isArray(response)
        ? response.filter((user) => user.designation?.toLowerCase() === "doctor")
        : [];
      setDoctors(doctorList);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    }
  };

  fetchDoctors();
}, [dispatch]);

  const isBedAssigned = !!item.bed;
  const patient = item.patient_details || {};

  const getDoctorNameById = (id) => {
    return doctors.find((doc) => doc.id === id)?.name || `Doctor ID: ${id}`;
  };

  const handleTransferDoctor = async (doctorId) => {
    try {
      await dispatch(transferDoctor({ id: item.id, data: { transfer_doctor: doctorId } }));
      //   message.success("Doctor transferred successfully");
      setEditingDoctor(false);
      dispatch(fetchAllIPD());
    } catch (err) {
      message.error("Failed to transfer doctor");
    }
  };

  return (
    <>
      <Card
        key={item.id}
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          padding: 10,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text strong>
            {patient.full_name || patient.patient_id || "N/A"}
          </Text>

          <div style={{ display: "flex", gap: 10 }}>
            <Text>
              {item.admit_date ? dayjs(item.admit_date).format("DD-MM-YYYY") : "N/A"}
            </Text>
            <Tag
              color={
                item.patient_type === "normal"
                  ? "green"
                  : item.patient_type === "mlc"
                    ? "orange"
                    : item.patient_type === "emergency"
                      ? "red"
                      : "blue"
              }
            >
              {item.patient_type || "N/A"}
            </Tag>
          </div>

        </div>
        <div style={{ marginTop: 4 }}>
          <Text strong></Text> {patient.gender || "--"} |{" "}
          <Text strong></Text> {patient.age || "--"} |{" "}
          <Text strong></Text> {patient.blood_group || "--"} | {""}
          <Text strong></Text> {patient.contact_number || "--"}
        </div>

        <div style={{ marginTop: 4 }}>
          <Text strong>Admitted Doctor:</Text>{" "}
          {getDoctorNameById(item.admitted_doctor)}
        </div>

        <div style={{ marginTop: 4 }}>
          <Text strong>Active Doctor:</Text>{" "}
          {editingDoctor ? (
            <Select
              style={{ width: 200 }}
              defaultValue={item.active_doctor}
              onChange={handleTransferDoctor}
              onBlur={() => setEditingDoctor(false)}
              autoFocus
            >
              {doctors.map((doc) => (
                <Option key={doc.id} value={doc.id}>
                  {doc.name}
                </Option>
              ))}
            </Select>
          ) : (
            <span
              style={{ cursor: "pointer", color: "#1890ff" }}
              onClick={() => setEditingDoctor(true)}
            >
              {getDoctorNameById(item.active_doctor)}
            </span>
          )}
        </div>

        <div style={{ marginTop: 4 }}>
          <Text strong>Ward:</Text> {item.bill_category || "--"} | {""}
          <Text strong>Department:</Text> {item.department || "--"}
        </div>
        <div style={{ marginTop: 4 }}>
          <Text strong>Reason:</Text> {item.description || "--"}
        </div>

        <div style={{ textAlign: "right", marginTop: 16 }}>
          <Button
            type="primary"
            onClick={() => setAssignModalVisible(true)}
            disabled={isBedAssigned}
            style={{ marginLeft: 8 }}
          >
            {isBedAssigned ? "Bed Assigned" : "Assign Bed"}
          </Button>
        </div>
      </Card>

      <AssignBedModal
        visible={assignModalVisible}
        onClose={() => setAssignModalVisible(false)}
        patientId={patient.id}
        onAssign={(details) => {
          setAssignedBedDetails(details);
          setAssignModalVisible(false);
          dispatch(fetchAllIPD());
        }}
      />
    </>
  );
};

export default IPDCard;
