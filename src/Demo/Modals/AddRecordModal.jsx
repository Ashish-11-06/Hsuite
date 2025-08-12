import React, { useState } from "react";
import { Modal, Input, Form } from "antd";

const { TextArea } = Input;

const AddRecordModal = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values.title, values.record);
      form.resetFields();
    });
  };

  return (
    <Modal
      open={visible}
      title="Add Custom History Field"
      onCancel={onClose}
      onOk={handleOk}
      okText="Add Record"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input placeholder="e.g. Genetic Conditions" />
        </Form.Item>
        <Form.Item
          name="record"
          label="Record"
          rules={[{ required: true, message: "Please enter record details" }]}
        >
          <TextArea rows={4} placeholder="Enter the record details here..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRecordModal;
