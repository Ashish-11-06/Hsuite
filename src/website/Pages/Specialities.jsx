// src/pages/Specialities.jsx
import React from 'react';
import { Card, Typography, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

// 🎯 Specialities data (can be moved to a separate file later)
const specialtiesData = [
  {
    id: 1,
    name: "Cardiology",
    description: "Expert heart care including diagnostics, treatment, and surgical interventions.",
  },
  {
    id: 2,
    name: "Neurology",
    description: "Comprehensive brain and nervous system diagnosis and care.",
  },
  {
    id: 3,
    name: "Orthopedics",
    description: "Bone and joint treatments including joint replacement and trauma care.",
  },
  {
    id: 4,
    name: "Pediatrics",
    description: "Dedicated care for infants, children, and adolescents.",
  },
  {
    id: 5,
    name: "Oncology",
    description: "Advanced cancer treatment with compassionate support and technology.",
  },
  {
    id: 6,
    name: "Gynecology & Obstetrics",
    description: "Women's health including maternity care and gynecological surgery.",
  },
];

const Specialities = () => {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: 'auto' }}>
      <Title level={2}>Our Specialities</Title>
      <Paragraph>
        HSuite Hospital offers a wide range of specialized medical services to cater to every patient’s need.
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: 30 }}>
        {specialtiesData.map((specialty) => (
          <Col xs={24} sm={12} md={8} key={specialty.id}>
            <Card title={specialty.name} bordered hoverable>
              <p>{specialty.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Specialities;
