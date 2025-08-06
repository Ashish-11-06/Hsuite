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

  const [status, setStatus] = useState(record.status || "waiting");
  const [paymentStatus] = useState(record.payment_status || "unpaid");
  const [doctor, setDoctor] = useState(record.doctor || (doctors.length > 0 ? doctors[0].id : ""));
  const [description] = useState(record.description || "");
  const [isStatusEditing, setIsStatusEditing] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isPerticularModalOpen, setIsPerticularModalOpen] = useState(false);

  const patient = record.patient || {};
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
          // backgroundColor: getCardBackgroundColor(),
          border:
            record.opd_type === "emergency" &&
              status !== "completed" &&
              status !== "out"
              ? "2px solid red"
              : "1px solid #f0f0f0",
          transition: "background-color 0.3s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
          <Button
            type="link"
            onClick={() => {
              const patientId = record.patient?.id;
              const patient = record.patient;
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
              <strong>{record.date_time ? dayjs(record.date_time).format("hh:mm A") : "-"}</strong>
            </Text>


            {["doctor"].includes(currentUser?.designation) && status === "active" && (
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
                  if (["doctor", "admin", "nurse"].includes(currentUser?.designation) && status !== "out") {
                    setIsStatusEditing(true);
                  }
                }}
                style={{
                  cursor: ["doctor", "admin", "nurse"].includes(currentUser?.designation) && status !== "out" ? "pointer" : "not-allowed",
                  opacity: status === "out" ? 0.5 : 1,
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
            {patient.contact_number || "-"} | <b>ID: </b>{patient.patient_id}
          </div>
          <div style={{ marginTop: 4 }}>
            <b>Doctor:</b><Text>{getDoctorName(record.doctor)}</Text>
          </div>
          {description && (
            <div style={{ marginTop: 4 }}>
              <b>Description: </b><Text>{description}</Text>
            </div>
          )}
        </div>

        {["doctor", "admin", "nurse"].includes(currentUser?.designation) && (
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
            <Button size="small" onClick={() => setIsPerticularModalOpen(true)} disabled={status === "out"}>
              + Particulars
            </Button>
          </div>
        )}
      </Card>

      <AddPrescriptionModal
        open={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        patientId={record.patient.id}
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
