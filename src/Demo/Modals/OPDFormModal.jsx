import React from "react";
import { Modal, Form, Input, Select, DatePicker, Radio } from "antd";

const { Option } = Select;

const OPDFormModal = ({ visible, onCancel, onFinish, form, isEditing }) => {
  return (
    <Modal
      title={isEditing ? "Edit OPD Visit" : "Add OPD Visit"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.validateFields().then(onFinish)}
      okText={isEditing ? "Update" : "Add"}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="patientName" label="Patient Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="doctor" label="Doctor" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="department" label="Department" rules={[{ required: true }]}>
          <Select placeholder="Select Department">
            <Option value="Cardiology">Cardiology</Option>
            <Option value="Neurology">Neurology</Option>
            <Option value="Orthopedics">Orthopedics</Option>
            <Option value="ENT">ENT</Option>
            <Option value="General Medicine">General Medicine</Option>
          </Select>
        </Form.Item>
        <Form.Item name="visitDate" label="Visit Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="slot" label="Slot" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="Morning">Morning</Radio>
            <Radio value="Afternoon">Afternoon</Radio>
            <Radio value="Evening">Evening</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="chiefComplaint" label="Chief Complaint">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select>
            <Option value="Completed">Completed</Option>
            <Option value="Pending">Pending</Option>
          </Select>
        </Form.Item>
        <Form.Item name="diagnosis" label="Diagnosis">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="prescription" label="Prescription">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="followUp" label="Follow Up Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OPDFormModal;
