import React, { useEffect, useState } from "react";
import { Modal, Input, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PostPastCurrentHospitalHistory } from "../Redux/Slices/PatientHistorySlice";

const { Option } = Select;

const AddCurrentHospitalModal = ({ visible, onClose, patientId, onSuccess }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ diagnosis_name: "", doctor: null });
  const { users } = useSelector((state) => state.users);

  // const doctorOptions = users?.filter((user) => user.designation === "doctor");

  const doctorOptions = Array.isArray(users)
  ? users.filter((user) => user.designation === "doctor")
  : users?.results?.filter((user) => user.designation === "doctor") || [];


  const handleSubmit = async () => {
    if (!form.diagnosis_name || !form.doctor) {
      return message.warning("Please fill all fields");
    }

    const payload = {
      diagnosis_name: form.diagnosis_name,
      doctor: form.doctor,
      patient: patientId,
    };

    try {
      await dispatch(PostPastCurrentHospitalHistory(payload)).unwrap();
      setForm({ diagnosis_name: "", doctor: null });
      onClose();
      if (onSuccess) onSuccess(); // ✅ trigger refresh from parent
    } catch (err) {
      message.error("Submission failed");
    }
  };

  return (
    <Modal
      open={visible}
      title="Add Current Hospital History"
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Save"
    >
      <label>Diagnosis Name</label>
      <Input
        value={form.diagnosis_name}
        onChange={(e) => setForm({ ...form, diagnosis_name: e.target.value })}
        placeholder="Enter diagnosis"
        style={{ marginBottom: 10 }}
      />

      <label>Select Doctor</label>
      <Select
        placeholder="Select a doctor"
        value={form.doctor}
        onChange={(value) => setForm({ ...form, doctor: value })}
        style={{ width: "100%", marginBottom: 10 }}
        showSearch
        optionFilterProp="children"
      >
        {doctorOptions?.map((doctor) => (
          <Option key={doctor.id} value={doctor.id}>
            {doctor.name}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default AddCurrentHospitalModal;
