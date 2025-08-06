import React from "react";
import { Modal, Form, Input, Button, Checkbox, Select } from "antd";
import { useDispatch } from "react-redux";
import { postStockMedicine } from "../Redux/Slices/BillingSlice";
import { getPharmacyMedicine } from "../Redux/Slices/StockSlice";

const { Option } = Select;

const AddStockMedicineModal = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleFinish = (values) => {
    const payload = {
      medicine_name: values.medicine_name,
      medicine_type: values.medicine_type,
      medicine_unit: values.medicine_unit,
      manufacturer: values.manufacturer,
      is_narcotic: values.is_narcotic || false,
      description: values.description,
    };

    dispatch(postStockMedicine(payload));
    form.resetFields();
    dispatch(getPharmacyMedicine());
    onCancel();
  };

  return (
    <Modal
      open={open}
      title="Add New Medicine"
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="medicine_name"
          label="Medicine Name"
          rules={[{ required: true, message: "Please enter the medicine name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="medicine_type"
          label="Medicine Type"
          rules={[{ required: true, message: "Please select the medicine type" }]}
        >
          <Select placeholder="Select type">
            <Option value="tablet">Tablet</Option>
            <Option value="liquid">Liquid</Option>
            <Option value="injection">Injection</Option>
            <Option value="ointment">Ointment</Option>
            <Option value="inhaler">Inhaler</Option>
            <Option value="drops">Drops</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="medicine_unit"
          label="Unit"
          rules={[{ required: true, message: "Please select the unit" }]}
        >
          <Select placeholder="Select unit">
            <Option value="mg">mg</Option>
            <Option value="ml">ml</Option>
            <Option value="g">g</Option>
            <Option value="units">units</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="manufacturer"
          label="Manufacturer"
          rules={[{ required: true, message: "Please enter the manufacturer" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please provide a description" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="is_narcotic"
          valuePropName="checked"
        >
          <Checkbox>is Narcotic Medicine</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Medicine
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStockMedicineModal;
