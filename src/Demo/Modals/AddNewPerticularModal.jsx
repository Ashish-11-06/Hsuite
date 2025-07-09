// AddNewPerticularModal.jsx
import React, { useState } from "react";
import { Modal, Input, Button, Space, message, Form } from "antd";
import { useDispatch } from "react-redux";
import { PostPerticulars } from "../Redux/Slices/OpdSlice";
import { getBillParticulars } from "../Redux/Slices/BillingSlice";

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
      // await dispatch(getBillParticulars());
      onAddSuccess(trimmed, amountValue, trimmedDesc); // callback to parent
      onClose();
      setName("");
      setAmount("");
      setDescription("");
    } catch (err) {
      // console.error(err);
      message.error("Failed to add perticular");
    }
  };

  return (
    <Modal title="Add New Perticular" open={open} onCancel={onClose} footer={null} destroyOnClose>

      <Form layout="vertical">
        <Form.Item label="Perticular Name" required>
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
