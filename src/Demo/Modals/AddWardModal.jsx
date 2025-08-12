import React, { useMemo, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Button, Space } from "antd";

const { Option } = Select;

const AddWardModal = ({ open, onClose, onSubmit, loading, wards = [] }) => {
  const [form] = Form.useForm();
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Extract unique building names
  const existingBuildings = useMemo(() => {
    const buildings = wards.map((w) => w.building).filter(Boolean);
    return [...new Set(buildings)];
  }, [wards]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title="Add New Ward"
      onCancel={() => form.resetFields() || onClose()}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Building" required>
          <Space.Compact style={{ width: "100%" }}>
            <Form.Item
              name="building"
              noStyle
              rules={[{ required: true, message: "Please select or enter a building" }]}
            >
              {isAddingNew ? (
                <Input style={{ width: "100%" }} placeholder="Enter new building" />
              ) : (
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select building"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {existingBuildings.map((building) => (
                    <Option key={building} value={building}>
                      {building}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Button
              type="primary"
              onClick={() => {
                setIsAddingNew(!isAddingNew);
                form.setFieldsValue({ building: undefined });
              }}
            >
              {isAddingNew ? "Cancel" : "Add New"}
            </Button>
          </Space.Compact>

        </Form.Item>

        <Form.Item name="floor" label="Floor" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="ward_name" label="Ward Name/Number" rules={[{ required: true }]}>
          <Input placeholder="Enter ward name/number" />
        </Form.Item>
        <Form.Item name="ward_type" label="Ward Type" rules={[{ required: true }]}>
          <Select placeholder="Select ward type">
            <Option value="general">General</Option>
            <Option value="icu">ICU</Option>
            <Option value="private">Private</Option>
            <Option value="semi-private">Semi-Private</Option> {/* ✅ Add this */}
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Add Ward
        </Button>
      </Form>
    </Modal>
  );
};

export default AddWardModal;
