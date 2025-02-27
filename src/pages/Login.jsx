// src/components/Login.js
import React, { useState } from "react";
import { Form, Input, Button, Card, message, Modal } from "antd";
import { useDispatch } from "react-redux";
import { login } from "../Redux/Slices/authSlice";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Login = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  const onFinish = (values) => {
    // Simulated authentication logic
    if (values.username === "admin" && values.password === "password") {
      dispatch(login({ username: values.username }));
      message.success("Login successful!");
      // Redirect or perform other actions here
    } else {
      message.error("Invalid credentials!");
    }
  };

  const showModal = () => {
    setIsModalVisible(true); // Show the modal
  };

  const handleOk = () => {
    setIsModalVisible(false); // Close the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  const onRegisterFinish = (values) => {
    console.log("Registration values:", values);
    // Handle registration logic here
    message.success("Registration successful!");
    handleOk(); // Close the modal after successful registration
  };

  return (
    <Card title="Login" style={{ width: 300, margin: "100px auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
      <p>
        Don't have an account? <Button type="link" onClick={showModal}>Register</Button>
      </p>

      {/* Registration Modal */}
      <Modal
        title="Register"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null} // We will use our own footer
      >
        <Form layout="vertical" onFinish={onRegisterFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }, { type: 'email', message: 'The input is not valid E-mail!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Login;