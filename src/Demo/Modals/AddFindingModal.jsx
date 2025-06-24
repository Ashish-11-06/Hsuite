// components/AddFindingModal.jsx
import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, message } from "antd";
import { useDispatch } from "react-redux";
import { GetFinding, PostFinding } from "../Redux/Slices/PatientHistorySlice";

const AddFindingModal = ({ open, onClose, patientId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        patient: patientId,
        date: values.date.format("YYYY-MM-DD"),
      };
      dispatch(PostFinding(payload))
        .unwrap()
        .then((res) => {
          message.success(res?.message || "Finding added successfully");
          form.resetFields();
          dispatch(GetFinding(patientId));
          onClose();
        })
        .catch((err) => {
          const errorMsg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to add finding";
          message.error(errorMsg);
        });
    });
  };

  return (
    <Modal
      title="Add New Finding"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Save"
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="temperature" label="Temperature">
          <Input />
        </Form.Item>
        <Form.Item name="pulse" label="Pulse">
          <Input />
        </Form.Item>
        <Form.Item name="blood_pressure" label="Blood Pressure">
          <Input />
        </Form.Item>
        <Form.Item name="weight" label="Weight">
          <Input />
        </Form.Item>
        <Form.Item name="height" label="Height">
          <Input />
        </Form.Item>
        <Form.Item name="cns" label="CNS">
          <Input />
        </Form.Item>
        <Form.Item name="rs" label="RS">
          <Input />
        </Form.Item>
        <Form.Item name="pa" label="PA">
          <Input />
        </Form.Item>
        <Form.Item name="wbc" label="WBC">
          <Input />
        </Form.Item>
        <Form.Item name="rbc" label="RBC">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFindingModal;
