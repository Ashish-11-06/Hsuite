import React from "react";
import { Drawer, Divider, Button } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const PatientDetailsDrawer = ({ visible, onClose, patient }) => {
  const navigate = useNavigate();

  const handleViewHistory = () => {
    navigate("/demo/patient-history", { state: { patient_id:patient.id,patient } });

  };

  return (
    <Drawer
      title=" Patient Full Details"
      width={420}
      onClose={onClose}
      open={visible}
      footer={
        <Button type="primary" onClick={handleViewHistory} disabled={!patient}>
          View History
        </Button>

      }
    >
      {patient && (
        <div>
          <p><b>ID:</b> {patient.id}</p>
          <p><b>Name:</b> {patient.full_name}</p>
          <p><b>Age:</b> {patient.age}</p>
          <p><b>Gender:</b> {patient.gender}</p>
          <p><b>Contact:</b> {patient.contact_number}</p>
          <p><b>Email:</b> {patient.email}</p>
          <p><b>Emergency Contact:</b> {patient.emergency_contact_number}</p>
          <p><b>Address:</b> {patient.address}</p>
          <p><b>Blood Group:</b> {patient.blood_group}</p>
          <Divider />
          {/* <p><b>Allergies:</b></p>
          {Array.isArray(patient.known_allergies) &&
            patient.known_allergies.map((allergy, index) => (
              <p key={index}>
                • {allergy.name} – {allergy.description}
              </p>
            ))} */}

          {/* <p><b>Medical History:</b></p>
          {Array.isArray(patient.medical_history) &&
            patient.medical_history.map((record, index) => (
              <p key={index}>
                • {record.name} – {record.description}
              </p>
            ))} */}

          {/* <p><b>Admission done on:</b> {patient.created_at}</p> */}
         <p><b>Last Visit:</b> {patient.date ? dayjs(patient.date).format("DD-MM-YYYY") : "-"}</p>
        </div>
      )}
    </Drawer>
  );
};

export default PatientDetailsDrawer;
