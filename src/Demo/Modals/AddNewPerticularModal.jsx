// AddNewPerticularModal.jsx
import React, { useState } from "react";
import { Modal, Input, Button, Space, message, Form, Select } from "antd";
import { useDispatch } from "react-redux";
import { PostPerticulars } from "../Redux/Slices/OpdSlice";

const { Option } = Select;

const AddNewPerticularModal = ({ open, onClose, onAddSuccess }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = async () => {
    const trimmed = name.trim();
    const trimmedDesc = description.trim();
    const amountValue = parseFloat(amount);

    if (!trimmed || !trimmedDesc || isNaN(amountValue) || amountValue <= 0 || !type) {
      message.error("Please fill all fields correctly");
      return;
    }

    const body = {
      name: trimmed,
      amount: amountValue,
      description: trimmedDesc,
      type,
    };

    try {
      await dispatch(PostPerticulars(body)).unwrap();
      onAddSuccess(trimmed, amountValue, trimmedDesc, type);
      onClose();
      setName("");
      setAmount("");
      setDescription("");
      setType("");
    } catch (err) {
      // message.error("Failed to add particular");
    }
  };

  return (
    <Modal
      title="Add New Particular"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical">
        <Form.Item label="Particular Name" required>
          <Input
            placeholder="Paracetamol"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Amount" required>
          <Input
            placeholder="2"
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Description" required>
          <Input
            placeholder="Used for fever and mild pain"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Type" required>
          <Select
            placeholder="Select type"
            value={type}
            onChange={(val) => setType(val)}
          >
            <Option value="consultation">Consultation</Option>
            <Option value="diagnosis">Diagnosis</Option>
            <Option value="medicine">Medicine</Option>
            <Option value="test">Test</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleSubmit} block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewPerticularModal;
