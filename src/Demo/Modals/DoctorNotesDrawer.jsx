import React from "react";
import { Drawer } from "antd";

const DoctorNotesDrawer = ({ visible, onClose, record }) => {
  return (
    <Drawer title="OPD Visit Details" width={400} onClose={onClose} open={visible}>
      {record && (
        <div>
          <p><b>ID:</b> {record.id}</p>
          <p><b>Patient Name:</b> {record.patientName}</p>
          <p><b>Doctor:</b> {record.doctor}</p>
          <p><b>Department:</b> {record.department}</p>
          <p><b>Visit Date:</b> {record.visitDate}</p>
          <p><b>Slot:</b> {record.slot}</p>
          <p><b>Status:</b> {record.status}</p>
          <p><b>Chief Complaint:</b> {record.chiefComplaint}</p>
          <p><b>Diagnosis:</b> {record.diagnosis}</p>
          <p><b>Prescription:</b> {record.prescription}</p>
          <p><b>Follow Up:</b> {record.followUp}</p>
        </div>
      )}
    </Drawer>
  );
};

export default DoctorNotesDrawer;
