// src/Modals/AddHospitalHistoryModal.jsx
import React, { useState } from "react";
import { Modal, Input, message, Typography } from "antd";
import { useDispatch } from "react-redux";
import { PostPatientPastHospitalHistory } from "../Redux/Slices/PatientHistorySlice";

const { Text } = Typography;

const AddHospitalHistoryModal = ({ visible, onClose, patientId, onSuccess }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    diagnosis_name: "",
    hospital_name: "",
    address: "",
    doctor_name: "",
  });

  const handleSubmit = async () => {
    const payload = {
      patient: patientId,
      ...form,
    };

    try {
      await dispatch(PostPatientPastHospitalHistory(payload)).unwrap();
      onClose();
      setForm({
        diagnosis_name: "",
        hospital_name: "",
        address: "",
        doctor_name: "",
      });
      if (onSuccess) onSuccess(); // Refresh parent
    } catch (error) {
      message.error("Submission failed");
    }
  };

  return (
    <Modal
      open={visible}
      title="Add Past Hospital History"
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Save"
    >
      <div style={{ marginBottom: 12 }}>
        <Text strong>Diagnosis Name</Text>
        <Input
          placeholder="Enter diagnosis"
          value={form.diagnosis_name}
          onChange={(e) => setForm({ ...form, diagnosis_name: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text strong>Hospital Name</Text>
        <Input
          placeholder="Enter hospital name"
          value={form.hospital_name}
          onChange={(e) => setForm({ ...form, hospital_name: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text strong>Address</Text>
        <Input
          placeholder="Enter address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>

      <div>
        <Text strong>Doctor Name</Text>
        <Input
          placeholder="Enter doctor name"
          value={form.doctor_name}
          onChange={(e) => setForm({ ...form, doctor_name: e.target.value })}
        />
      </div>
    </Modal>
  );
};

export default AddHospitalHistoryModal;
