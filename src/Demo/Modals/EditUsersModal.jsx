import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { useDispatch } from "react-redux";
import { UpdateUsers, GetAllUsers } from "../Redux/Slices/UsersSlice";

const { Option } = Select;

const EditUsersModal = ({ visible, onClose, userData }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      form.setFieldsValue(userData);
    }
  }, [userData, form]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        id: userData.id,
        payload: values,
      };
      await dispatch(UpdateUsers(payload)).unwrap();
      dispatch(GetAllUsers());

      onClose();
      form.resetFields();
    } catch (error) {
      message.error("Failed to update user.");
    }
  };

  return (
    <Modal
      open={visible}
      title="Edit User"
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleUpdate}
      okText="Update"
    >
      <Form form={form} layout="vertical">
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
      </Form>
    </Modal>
  );
};

export default EditUsersModal;
