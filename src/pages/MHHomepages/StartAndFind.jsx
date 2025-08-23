// src/Components/Hero.jsx
import React from "react";
import { Typography, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Hero = () => {
  const navigate = useNavigate(); // hook for navigation

  return (
    <div
      style={{
        marginBottom: "40px",
        padding: "40px 20px",
        background: "#f9f9f9",
        borderRadius: "12px",
      }}
    >
      <Row gutter={[32, 32]} align="middle">
        {/* Left - Image */}
        <Col xs={24} md={12}>
          <img
            src="/mental_health.jpg"
            alt="Mental Health"
            style={{
              width: "100%",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        </Col>

        {/* Right - Text */}
        <Col xs={24} md={12}>
          <div style={{ textAlign: "left", padding: "20px" }}>
            <Title level={2}>Your Health, Mind & Wellbeing</Title>
            <Paragraph style={{ fontSize: "16px", maxWidth: "500px" }}>
              Take assessments, discover your personality traits, and connect
              with trusted counsellors for better mental and physical health.
            </Paragraph>
            <div style={{ marginTop: "20px" }}>
              <Button
                type="primary"
                size="large"
                style={{ marginRight: "12px" }}
                onClick={() => navigate("/medicalHealth/assessment")}
              >
                Start Assessment
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/medicalHealth/counsellor")}
              >
                Find a Counsellor
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Hero;
