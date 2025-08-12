// src/Modals/AddAllergyModal.jsx
import React from "react";
import { Modal, Input, Typography, message } from "antd";
import { useDispatch } from "react-redux";
import { PostAllergies } from "../Redux/Slices/PatientHistorySlice";

const { Text } = Typography;

const AddAllergyModal = ({
  visible,
  onCancel,
  onSuccess,
  formState,
  setFormState,
  patientId,
}) => {
  const dispatch = useDispatch();

  const handleSave = async () => {
    if (!formState.allergen || !formState.reaction) {
      return message.warning("Please enter both Allergen and Reaction.");
    }

    const payload = {
      name: formState.allergen,
      description: formState.reaction,
      patient_id: patientId,
    };

    try {
      await dispatch(PostAllergies(payload)).unwrap();
      onCancel(); // close modal
      setFormState({ allergen: "", reaction: "" }); // reset form
      if (onSuccess) onSuccess(); // callback to refetch
    } catch (err) {
      message.error("Failed to add allergy.");
    }
  };

  const renderInput = (label, value, key) => (
    <div style={{ marginBottom: 12 }}>
      <Text strong>{label}</Text>
      <Input
        value={value}
        onChange={(e) => setFormState({ ...formState, [key]: e.target.value })}
        placeholder={`Enter ${label}`}
        style={{ marginTop: 4 }}
      />
    </div>
  );

  return (
    <Modal
      open={visible}
      title="Add Allergy"
      onCancel={onCancel}
      onOk={handleSave}
      okText="Save"
    >
      {renderInput("Name", formState.allergen, "allergen")}
      {renderInput("Description", formState.reaction, "reaction")}
    </Modal>
  );
};

export default AddAllergyModal;
