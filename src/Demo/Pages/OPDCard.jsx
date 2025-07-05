import React, { useState } from "react";
import { Card, Typography, Tag, Button, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import AddPrescriptionModal from "../Modals/AddPrescriptionModal";
import AddPerticularsModal from "../Modals/AddPerticularsModal";

const { Text } = Typography;
const { Option } = Select;

const OPDCard = ({ record, onEdit, doctors = [], patientDetails = {} }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("HMS-user"));
console.log('patient details',patientDetails);

  const [status, setStatus] = useState(record.status || "waiting");
  const [paymentStatus] = useState(record.payment_status || "unpaid");
  const [doctor, setDoctor] = useState(record.doctor || (doctors.length > 0 ? doctors[0].id : ""));
  const [description] = useState(record.description || "");
  const [isStatusEditing, setIsStatusEditing] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isPerticularModalOpen, setIsPerticularModalOpen] = useState(false);

  const patient = patientDetails[record.patient] || {};
console.log('patient',patient);

  const getCardBackgroundColor = () => {
    if (status === "out" && paymentStatus === "paid") return "#d9f7be";
    if (status === "out" && paymentStatus === "unpaid") return "#ffa39e";
    return "#fff";
  };

  const formatStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const getDoctorName = (doctorId) => {
    const d = doctors.find(doc => doc.id === doctorId);
    return d ? d.name : "Unknown Doctor";
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setIsStatusEditing(false);
    const updateBody =
      currentUser?.designation === "doctor"
        ? { status: newStatus }
        : {
          status: newStatus,
          payment_status: paymentStatus,
          doctor,
          description,
        };

    onEdit({
      id: record.id,
      body: updateBody,
    });
  };

  return (
    <>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          padding: 5,
          marginBottom: 5,
          backgroundColor: getCardBackgroundColor(),
          transition: "background-color 0.3s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
       <Button
  type="link"
  onClick={() => {
    const patientId = record.patient;
    const patient = patientDetails[patientId];
    navigate("/demo/patient-history", {
      state: {
        patient_id: patientId,  // used for all API calls
        patient: patient        // used for showing name, age, gender
      }
    });
  }}
  style={{ fontSize: 17, padding: 0 }}
>
  <strong>{patient.full_name || "Unknown Patient"}</strong>
</Button>


          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: 6,
                padding: "2px 8px",
                fontSize: 13,
                backgroundColor: "#fafafa",
              }}
            >
              No. of Visits: <strong>{record.visit_count || 1}</strong>
            </div>

            <Text style={{ fontSize: 13 }}>
              <strong>{record.date_time ? dayjs(record.date_time).format("YYYY-MM-DD") : "-"}</strong>
            </Text>

            {currentUser?.designation === "doctor" && status === "active" && (
              <Button size="small" type="primary" onClick={() => setIsPrescriptionModalOpen(true)} icon={<PlusOutlined />}>
                Prescription
              </Button>
            )}

            {!isStatusEditing ? (
              <Tag
                color={
                  status === "completed"
                    ? "green"
                    : status === "waiting"
                      ? "orange"
                      : status === "active"
                        ? "yellow"
                        : status === "out"
                          ? "blue"
                          : "red"
                }
                onDoubleClick={() => {
                  if (["doctor", "admin"].includes(currentUser?.designation)) {
                    setIsStatusEditing(true);
                  }
                }}
                style={{
                  cursor: ["doctor", "admin"].includes(currentUser?.designation) ? "pointer" : "default",
                }}
              >
                {formatStatus(status)}
              </Tag>
            ) : (
              <Select
                size="small"
                value={status}
                onChange={handleStatusChange}
                onBlur={() => setIsStatusEditing(false)}
                style={{ width: 120 }}
                autoFocus
              >
                <Option value="waiting">Waiting</Option>
                <Option value="active">Active</Option>
                <Option value="completed">Completed</Option>
                {currentUser?.designation === "admin" && <Option value="out">Out</Option>}
              </Select>
            )}
          </div>
        </div>

        {/* Patient Info */}
        <div style={{ marginTop: 8 }}>
          <div>
            {patient.age || "-"} | {patient.gender || "-"} | {patient.address || "-"}
          </div>
          <div>
            {patient.contact || "-"} | ID: {patient.patient_id}
          </div>
          <div style={{ marginTop: 4 }}>
            Doctor: <Text>{getDoctorName(record.doctor)}</Text>
          </div>
          {description && (
            <div style={{ marginTop: 4 }}>
              Description: <Text>{description}</Text>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button size="small" onClick={() => setIsPerticularModalOpen(true)}>
            + Perticulars
          </Button>
        </div>
      </Card>

      <AddPrescriptionModal
        open={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        patientId={record.patient}
        userId={currentUser?.id}
      />
      <AddPerticularsModal
        open={isPerticularModalOpen}
        onClose={() => setIsPerticularModalOpen(false)}
        onSubmit={() => { }}
        patientId={record.patient}
      />
    </>
  );
};

export default OPDCard;
