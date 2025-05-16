import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Typography,
  Space,
} from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/Slices/authSlice";
import RegisterModal from "../Modals/RegisterModal";
import ForgotPasswordModal from "../Modals/ForgotPasswordModal";

const { Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = async (values) => {
    try {
      const response = await dispatch(loginUser(values)).unwrap();
      message.success(response?.message || "Login successful!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      message.error(error?.error || "Invalid email or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // background: "linear-gradient(to bottom, #cbe9ff, #eaf6ff)",
        background: "linear-gradient(178deg, rgba(179, 233, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)"

      }}
    >
      <Card
        style={{
          width: 400,
          padding: "20px 10px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.75)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
        variant="borderless"
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <LoginOutlined style={{ fontSize: 40, color: "#1890ff" }} />
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#333",
              marginTop: 10,
              marginBottom: 8,
            }}
          >
            Sign in with email
          </div>
        </div>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input size="large" placeholder="Enter your email address" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: "right", marginTop: -8 }}>
              <Button
                type="link"
                size="small"
                style={{ padding: 0 }}
                onClick={() => setShowForgotModal(true)}
              >
                Forgot password?
              </Button>

            </div>
          </Form.Item>


          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                borderColor: "#000",
                borderRadius: 8,
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <p style={{ textAlign: "center", marginTop: 16 }}>
          Don't have an account?{" "}
          <Button type="link" onClick={() => setIsModalVisible(true)}>
            Register
          </Button>
        </p>

        <RegisterModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
        <ForgotPasswordModal 
        visible={showForgotModal}
        onCancel={() => setShowForgotModal(false)}
        />
      </Card>
    </div>
  );
};

export default Login;
