// AddNewPerticularModal.jsx
import React, { useState } from "react";
import { Modal, Input, Button, Space, message } from "antd";
import { useDispatch } from "react-redux";
import { PostPerticulars } from "../Redux/Slices/OpdSlice";

const AddNewPerticularModal = ({ open, onClose, onAddSuccess }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    const trimmed = name.trim();
    const trimmedDesc = description.trim();
    const amountValue = parseFloat(amount);

    if (!trimmed || !trimmedDesc || isNaN(amountValue) || amountValue <= 0) {
      message.error("Please fill all fields correctly");
      return;
    }

    const body = {
      name: trimmed,
      amount: amountValue,
      description: trimmedDesc,
    };

    try {
      await dispatch(PostPerticulars(body)).unwrap();
    //   message.success("Perticular added");
      onAddSuccess(trimmed, amountValue, trimmedDesc); // callback to parent
      onClose();
      setName("");
      setAmount("");
      setDescription("");
    } catch (err) {
      console.error(err);
      message.error("Failed to add perticular");
    }
  };

  return (
    <Modal title="Add New Perticular" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input
          placeholder="Perticular Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Space>
    </Modal>
  );
};

export default AddNewPerticularModal;
