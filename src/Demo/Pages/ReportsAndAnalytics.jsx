import React from "react";
import { Card, Typography, Row, Col } from "antd";
import { BarChartOutlined, LineChartOutlined, PieChartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ReportsAndAnalytics = () => {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <Title level={2} style={{ color: "#082d8f" }}>
        Reports & Analytics
      </Title>

      <Text type="secondary" style={{ fontSize: "16px" }}>
        This feature is currently under development. <span style={{color:"green"}}>Coming Soon!</span>
      </Text>

      <Row gutter={[24, 24]} justify="center" style={{ marginTop: "40px" }}>
        <Col xs={24} sm={12} md={8}>
          <Card
             variant="borderless"
            style={{
              minHeight: "180px",
              background: "#f5faff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}
          >
            <BarChartOutlined style={{ fontSize: "32px", color: "#0077b6" }} />
            <Title level={4} style={{ marginTop: "16px" }}>Visits by Department</Title>
            <Text type="secondary">Track patient visits per department</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            variant="borderless"
            style={{
              minHeight: "180px",
              background: "#f5faff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}
          >
            <PieChartOutlined style={{ fontSize: "32px", color: "#0077b6" }} />
            <Title level={4} style={{ marginTop: "16px" }}>Gender Distribution</Title>
            <Text type="secondary">Visualize patient gender ratio</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
             variant="borderless"
            style={{
              minHeight: "180px",
              background: "#f5faff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}
          >
            <LineChartOutlined style={{ fontSize: "32px", color: "#0077b6" }} />
            <Title level={4} style={{ marginTop: "16px" }}>Generated Revenue</Title>
            <Text type="secondary">Analyze revenue trends and totals</Text>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: "40px", fontStyle: "italic", color: "#888" }}>
        Stay tuned for powerful insights!
      </div>
    </div>
  );
};

export default ReportsAndAnalytics;
