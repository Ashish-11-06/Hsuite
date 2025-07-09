import React from "react";
import { Form, Input, Button, Card, Typography, message, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { postUserLogin } from "../Redux/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { LockOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DemoLogin = () => {
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
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      position: "relative",
      overflow: "hidden",
      flexDirection: "column" // ADD THIS to allow stacking header + main
    }}>

      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          top: 0,
          left: 0,
          zIndex: 0,
          filter: `
             blur(2px)             
              invert(1)             /* 👈 Makes dark → light */
              hue-rotate(180deg)    /* 👈 Shifts navy → sky blue */
              brightness(1.3)       /* 👈 Brightens overall */
              contrast(0.85)        /* 👈 Softens harsh contrast */
            `,
          // transform: "scaleX(-1)"
        }}
      >
        <source src="/medical-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>


      <div style={{
        width: "100%",
        textAlign: "center",
        marginTop: "40px",
        marginBottom: "20px",
        zIndex: 1
      }}>
        <Title level={2} style={{ color: "#2c3e50", margin: 0 }}>
          HSuite - Hospital Management System
        </Title>
      </div>

      {/* Main Content */}
      <div style={{
        display: "flex",
        width: "100%",
        maxWidth: "1200px",
        margin: "auto",
        padding: "24px",
        zIndex: 1
      }}>
        {/* Left Section - Branding and Info */}
        <div style={{
          flex: 1,
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "#ecf0f1",
          // background: "rgba(0, 0, 0, 0.4)",
          borderRadius: "0px",
          // backdropFilter: "blur(10px)",
          // boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          marginRight: "24px"
        }}>


          <div style={{ marginBottom: "40px" }}>
            <div style={{
              display: "inline-block",
              position: "relative",
              fontSize: "27px",
              fontWeight: 700,
              color: "#fff",
              overflow: "hidden",
              padding: "4px 8px",
            }}>
              <span style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(to right, #00d8ff, #0088ff)",
                animation: "sweepFull 1.5s ease-out forwards",
                borderRadius: "6px",
                zIndex: 0
              }} />
              <span style={{ position: "relative", zIndex: 1 }}>
                Streamline Your Healthcare Operations
              </span>
            </div>

            <div style={{ marginTop: "24px", fontWeight: "bold" }}>
              {[
                "Secure access for medical professionals",
                "Real-time patient management",
                "Integrated prescription system",
                "Automated billing and reporting"
              ].map((item, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#00d8ff",
                    marginRight: "12px"
                  }} />
                  <Text style={{ color: "#34495e" }}>{item}</Text>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: "24px",
            borderTop: "1px solid rgba(0,0,0,0.1)"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8V12L15 15" stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <Text style={{ color: "#7f8c8d", fontSize: "14px" }}>
              Need help? Contact our support team
            </Text>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Card
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
            bodyStyle={{ padding: 0 }}
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
          </Card>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.2); opacity: 0.3; }
        }
          @keyframes sweepFull {
    0% {
      left: -100%;
      width: 0%;
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
    100% {
      left: 0%;
      width: 100%;
      opacity: 1;
    }
  }
      `}</style>
    </div>
  );
};

export default DemoLogin;