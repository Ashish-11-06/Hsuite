import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Report = () => {
  const navigate = useNavigate();

  const reportItems = [
    { title: "Stock Report", path: "/stock-report" },
    { title: "Expiry Report", path: "/expiry-report" },
    { title: "Supplier Report", path: "/demo/supplier-report" }, // 🔗 Link this to SupplierTab.jsx
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Report Management</Title>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {reportItems.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              onClick={() => handleCardClick(item.path)}
              style={{
                borderRadius: 12,
                textAlign: "center",
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              {item.title}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Report;
