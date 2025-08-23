import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Select, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { registerMedical, verifyOtp } from "../Redux/Slices/MHAuthSlice.js";
import AddCounsellorDetailsModal from "../Modals/AddCounsellorDetailsModal.jsx";   // ✅ Import modal
import "./MHSignup.css";

const { Title } = Typography;
const { Option } = Select;

const MHSignup = ({ setShowSignup }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCounsellorModal, setShowCounsellorModal] = useState(false); // ✅ Modal control
  const [role, setRole] = useState("medicalRole");

  // Step 1: Register → send OTP
  const handleRegister = async () => {
    const values = form.getFieldsValue();
    if (values.password !== values.repeatPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(
        registerMedical({
          username: values.username,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          role: values.role,
        })
      ).unwrap();
      setUserId(result?.user_id);
      setRole(values.role);
      message.success("OTP sent to your email!");
    } catch (err) {
      console.error("Error:", err);
      message.error("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    const values = form.getFieldsValue();
    if (!userId) {
      message.error("Please register first to get OTP.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        verifyOtp({
          user_id: userId,
          otp: Number(values.otp),
        })
      ).unwrap();
      message.success("Account verified successfully!");

      // ✅ If counsellor → open modal
      if (role === "Counsellor") {
        setShowCounsellorModal(true);
      } else {
        setTimeout(() => setShowSignup(false), 1500);
      }
    } catch (err) {
      console.error("Error:", err);
      message.error("OTP verification failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-overlay"></div>

      <div className="signup-wrapper">
        {/* LEFT SIDE */}
        <div className="signup-slogan">
          “Your mental well-being matters.
          <br />
          Join us today and take the first step toward a healthier mind.”
        </div>

        {/* RIGHT SIDE: SIGNUP FORM */}
        <Card className="signup-card">
          <Title level={3} style={{ textAlign: "left", marginBottom: 20 }}>
            Register
          </Title>

          <Form layout="vertical" form={form}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            {/* First + Last Name in same row */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="first_name"
                  rules={[{ required: true, message: "First name is required" }]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="last_name"
                  rules={[{ required: true, message: "Last name is required" }]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="repeatPassword"
              rules={[{ required: true, message: "Please confirm password" }]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            {/* Email + Send OTP */}
            <Form.Item
              name="email"
              rules={[{ required: true, type: "email", message: "Valid email required" }]}
            >
              <Input
                placeholder="Email"
                addonAfter={
                  <Button type="primary" size="small" onClick={handleRegister} loading={loading}>
                    Send OTP
                  </Button>
                }
              />
            </Form.Item>

            <Form.Item name="otp">
              <Input placeholder="Enter OTP" />
            </Form.Item>

            <Form.Item
              name="role"
              rules={[{ required: true, message: "Please select a role" }]}
              initialValue="user"
            >
              <Select placeholder="Select your role" onChange={(val) => setRole(val)}>
                <Option value="user">Normal User</Option>
                <Option value="Counsellor">Counsellor</Option>
              </Select>
            </Form.Item>

            <Button
              type="primary"
              block
              size="large"
              loading={loading}
              onClick={handleVerifyOtp}
            >
              Verify & Register
            </Button>
          </Form>

          <div
            className="signup-toggle-text"
            onClick={() => setShowSignup(false)}
          >
            Already have an account? Login
          </div>
        </Card>
      </div>

      {/* ✅ Modal appears only if counsellor */}
      <AddCounsellorDetailsModal
        visible={showCounsellorModal}
        onClose={() => {
          setShowCounsellorModal(false);
          setShowSignup(false); // close signup after filling modal
        }}
        userId={userId}
      />
    </div>
  );
};

export default MHSignup;
