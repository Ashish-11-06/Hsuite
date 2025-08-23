// src/components/LoginCard.jsx
import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { postUserLogin } from "../Redux/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const LoginCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleFinish = async (values) => {
    try {
      const res = await dispatch(postUserLogin(values)).unwrap();
      const hospital = res?.hospital;
      const hms_user = res?.hms_user;

      if (res) {
        localStorage.setItem("Hospital-Id", JSON.stringify(hospital?.hospital_id));
        localStorage.setItem("HMS-user", JSON.stringify(hms_user));
      }

      navigate("/demo");
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "none",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={3} style={{ marginBottom: "8px", color: "#2c3e50" }}>Welcome Back</Title>
          <Text type="secondary" style={{ fontSize: "14px" }}>Sign in to access your dashboard</Text>
        </div>

        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              size="large"
              placeholder="Email address"
              prefix={<MailOutlined style={{ color: "#7f8c8d" }} />}
              style={{ borderRadius: "8px", padding: "12px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              prefix={<LockOutlined style={{ color: "#7f8c8d" }} />}
              style={{ borderRadius: "8px", padding: "12px" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                height: "48px",
                borderRadius: "8px",
                background: "linear-gradient(45deg, #00d8ff, #0088ff)",
                border: "none",
                fontWeight: 600,
                fontSize: "16px"
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginCard;
