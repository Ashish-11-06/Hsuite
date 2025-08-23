import React, { useState } from "react";
import { Input, Button, Card, Typography, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MHSignup from "./MHSignup";
import "./MHLogin.css";
import { loginMedical } from "../Redux/Slices/MHAuthSlice";

const { Title, Paragraph } = Typography;

const MHLogin = () => {
  const [showSignup, setShowSignup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // local state for login form
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // handle input changes
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // handle login
  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      message.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(loginMedical(credentials)).unwrap();
      // console.log("Login Response:", result);

      localStorage.setItem("medicalUser", JSON.stringify(result.user));
      localStorage.setItem("medicalRole", result.user.role);
      localStorage.setItem("medicalToken", result.token);

      navigate("/medicalHealth");
    } catch (err) {
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (showSignup) return <MHSignup setShowSignup={setShowSignup} />;

  return (
    <div className="mhlogin-container">
      <div className="mhlogin-overlay"></div>

      <div className="mhlogin-content">
        {/* Left Side with Slogan */}
        <div className="mhlogin-left">
          <div className="mhlogin-slogan-title">
            "Your Mental Health Matters"
          </div>
          <Paragraph className="mhlogin-slogan-text">
            Take the first step towards wellness.
            Log in to explore resources, assessments, and support
            designed to help you thrive.
          </Paragraph>
        </div>

        {/* Right Side with Login Form */}
        <div className="mhlogin-right">
          <Card className="mhlogin-card">
            <Title level={3}>Login</Title>
            <Input
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              className="mhlogin-input"
            />
            <Input.Password
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              className="mhlogin-input"
            />
            <Button
              type="primary"
              className="mhlogin-button"
              loading={loading}
              onClick={handleLogin}
            >
              Login
            </Button>
            <div
              className="mhlogin-toggle"
              onClick={() => setShowSignup(true)}
            >
              Don’t have an account? Sign up
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MHLogin;
