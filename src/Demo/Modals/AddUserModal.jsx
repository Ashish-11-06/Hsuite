import React from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { useDispatch } from "react-redux";
import { AddUsersByAdmin, GetAllUsers } from "../Redux/Slices/UsersSlice";

const { Option } = Select;

const AddUserModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(AddUsersByAdmin(values)).unwrap();
      dispatch(GetAllUsers());
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to add user. Please check the data.");
    }
  };

  return (
    <Modal
      open={visible}
      title="Add User"
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleSubmit}
      okText="Add"
    >
      <Form form={form} layout="vertical" >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Designation"
          name="designation"
          rules={[{ required: true, message: "Please select designation" }]}
        >
          <Select placeholder="Select designation">
            <Option value="doctor">Doctor</Option>
            <Option value="nurse">Nurse</Option>
            <Option value="receptionist">Receptionist</Option>
            <Option value="pharmacist">Pharmacist</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
