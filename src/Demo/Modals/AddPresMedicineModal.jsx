import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";

const AddPresMedicineModal = ({ open, onClose, onAdd, defaultData, prefillName }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onAdd(values);
      form.resetFields();
      onClose();
    });
  };

  useEffect(() => {
    if (defaultData) {
      form.setFieldsValue(defaultData);
    } else if (prefillName) {
      form.setFieldsValue({ medicine_name: prefillName });
    } else {
      form.resetFields();
    }
  }, [defaultData, prefillName, open]); // Add `open` to ensure it resets each time

  return (
    <Modal
      title={defaultData ? "Edit Medicine" : "Add Medicine"}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      okText={defaultData ? "Update" : "Add"}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="medicine_name"
          label="Medicine Name"
          rules={[{ required: true }]}
        >
          <Input placeholder="e.g. Paracetamol" />
        </Form.Item>

        <Form.Item
          name="dosage"
          label="Dosage"
          rules={[{ required: true }]}
        >
          <Input placeholder="e.g. 500mg" />
        </Form.Item>

        <Form.Item
          name="duration_days"
          label="Duration (days)"
          rules={[{ required: true, type: "number" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, type: "number" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="instruction"
          label="Instruction"
          rules={[{ required: true }]}
        >
          <Input placeholder="e.g. After food" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPresMedicineModal;
