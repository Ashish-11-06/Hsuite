// src/Components/Assessments.jsx
import React from "react";
import { Row, Col, Card, Typography, Button } from "antd";
import {
  HeartOutlined,
  SmileOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const AssessmentsOverview = () => {
  const navigate = useNavigate(); // for navigation

  return (
    <div>
      <Title level={3} style={{ marginBottom: "20px" }}>
        Explore Assessments
      </Title>
      <Row gutter={[24, 24]}>
        {/* Card 1: Medical Health Assessments */}
        <Col xs={24} md={8}>
          <Card hoverable bordered style={{ borderRadius: "10px" }}>
            <HeartOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
            <Title level={4}>Medical Health Assessments</Title>
            <Paragraph>
              Check your overall health and wellness instantly.
            </Paragraph>
            <Button
              type="link"
              onClick={() => navigate("/medicalHealth/mcqtest")}
            >
              Take Test →
            </Button>
          </Card>
        </Col>

        {/* Card 2: Personality Tests */}
        <Col xs={24} md={8}>
          <Card hoverable bordered style={{ borderRadius: "10px" }}>
            <SmileOutlined style={{ fontSize: "32px", color: "#52c41a" }} />
            <Title level={4}>Personality Tests</Title>
            <Paragraph>
              Discover your traits with Egogram & other personality tools.
            </Paragraph>
            <Button
              type="link"
              onClick={() => navigate("/medicalHealth/assessments")}
            >
              Explore →
            </Button>
          </Card>
        </Col>

        {/* Card 3: Counsellor Guidance */}
        <Col xs={24} md={8}>
          <Card hoverable bordered style={{ borderRadius: "10px" }}>
            <TeamOutlined style={{ fontSize: "32px", color: "#fa8c16" }} />
            <Title level={4}>Counsellor Guidance</Title>
            <Paragraph>
              Talk to certified experts and get professional support.
            </Paragraph>
            <Button
              type="link"
              onClick={() => navigate("/medicalHealth/counsellortreatment")}
            >
              Book Now →
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AssessmentsOverview;
