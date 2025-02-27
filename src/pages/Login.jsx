// src/components/Login.js
import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useDispatch } from "react-redux";
import { login } from "../Redux/Slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();

  const onFinish = (values) => {
    // Simulated authentication logic
    if (values.username === "admin" && values.password === "password") {
      // Dispatch the login action
      dispatch(login({ username: values.username }));

      // Log the user data to the console
      console.log("User  logged in:", { username: values.username });

      message.success("Login successful!");
      // Redirect or perform other actions here
    } else {
      message.error("Invalid credentials!");
    }
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
    </Card>
  );
};

export default Login;