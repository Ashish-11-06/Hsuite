import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useDispatch } from "react-redux";
import { postHospitalAndAdmin } from "../Redux/Slices/AuthSlice";

const HospitalRegister = () => {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      const res = await dispatch(postHospitalAndAdmin(values)).unwrap();
      message.success("Hospital registered successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to register hospital.");
    }
  };

  return (
    <Card title="Hospital Registration" style={{ maxWidth: 600, margin: "auto", marginTop: 50 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Hospital Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="owner" label="Owner" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="contact" label="Contact" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="admin_name" label="Admin Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="admin_email" label="Admin Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="admin_password" label="Admin Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register Hospital
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default HospitalRegister;
