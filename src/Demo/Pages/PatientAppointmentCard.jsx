import React, { useState } from "react";
import { Card, Descriptions, Select, Row, Col, Divider, message } from "antd";
import { useDispatch } from "react-redux";
import { updatePatientAppointment } from "../Redux/Slices/PatientRegisterSlice";

const { Option } = Select;

const PATIENT_STATUS_CHOICES = [
  { value: "available", label: "Available" },
  { value: "not_available", label: "Not Available" },
  // { value: "not_selected", label: "Not Selected"},
];

const PatientAppointmentCard = ({ appointment }) => {
  const dispatch = useDispatch();
  const {
    preferred_doctor,
    patient,
    department,
    reason,
    preferred_date_and_time,
    status,
    id,
    patient_status,
  } = appointment;

  const [selectedStatus, setSelectedStatus] = useState(patient_status || "available");

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    dispatch(updatePatientAppointment({ appointmentId: id, patient_status: value }))
      .then(() => {
      })
      .catch(() => {
        message.error("Failed to update status");
      });
  };

  return (
    <div>
      {/* Doctor Info Card */}
      <Card>
        <Descriptions column={1} >
          <Descriptions.Item label="Doctor Name">{preferred_doctor?.name}</Descriptions.Item>
          <Descriptions.Item label="Department">{department}</Descriptions.Item>
          <Descriptions.Item label="Email">{preferred_doctor?.email}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Divider between sections */}
      <Divider />

      {/* Patient Info */}
      <Descriptions column={1} style={{ marginTop: 5 }}>
        <Descriptions.Item label="Patient Name">{patient?.full_name}</Descriptions.Item>
        <Descriptions.Item label="Patient Age">{patient?.age}</Descriptions.Item>
        <Descriptions.Item label="Contact Number">{patient?.contact_number}</Descriptions.Item>
        <Descriptions.Item label="Reason">{reason}</Descriptions.Item>
        <Descriptions.Item label="Status">{status}</Descriptions.Item>
        <Descriptions.Item label="Preferred Date & Time">
          {new Date(preferred_date_and_time).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      {/* Dropdown at Bottom Right */}
      <Row justify="end" style={{ marginTop: 24 }}>
        <Col>
          <span style={{ marginRight: 8 }}>Patient Status: </span>
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            style={{ width: 200 }}
            disabled={status !== "rescheduled"}
          >
            {PATIENT_STATUS_CHOICES.map((choice) => (
              <Option key={choice.value} value={choice.value}>
                {choice.label}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </div>
  );
};

export default PatientAppointmentCard;
