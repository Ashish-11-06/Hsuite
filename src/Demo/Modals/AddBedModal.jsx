import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { getAllWards } from "../Redux/Slices/IpdSlice";

const { Option } = Select;

const AddBedModal = ({ open, onClose, onSubmit, loading, wards = [] }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title="Add New Bed"
      onCancel={() => form.resetFields() || onClose()}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="ward" label="Select Ward" rules={[{ required: true }]}>
          <Select placeholder="Select ward to add bed">
            {(Array.isArray(wards) ? wards : []).map((ward) => (
              <Option key={ward.id} value={ward.id}>
                {ward.ward_name} - Floor {ward.floor}, {ward.building}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="bed_no" label="Bed Number" rules={[{ required: true }]}>
          <Input placeholder="e.g. B101" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input placeholder="e.g. Corner bed near window" />
        </Form.Item>
        <Form.Item name="bed_type" label="Bed Type" rules={[{ required: true }]}>
          <Select placeholder="Select bed type">
            <Option value="standard">Standard</Option>
            <Option value="electric">Electric</Option>
            <Option value="manual">Manual</Option>
            <Option value="icu">ICU</Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Add Bed
        </Button>
      </Form>
    </Modal>
  );
};

export default AddBedModal;
