// src/pages/Career.jsx
import React from 'react';
import { Card, Button, Typography, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const jobOpenings = [
  {
    id: 1,
    title: "Staff Nurse",
    department: "Emergency",
    location: "Pune",
  },
  {
    id: 2,
    title: "Medical Officer",
    department: "General Medicine",
    location: "Mumbai",
  },
  {
    id: 3,
    title: "Lab Technician",
    department: "Diagnostics",
    location: "Nashik",
  },
];

const Career = () => {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: 'auto' }}>
      <Title level={2}>Join Our Team</Title>
      <Paragraph>
        At HSuite, we believe in delivering compassionate care with excellence. Join our growing team of dedicated professionals committed to improving lives.
      </Paragraph>

      <Title level={3} style={{ marginTop: 40 }}>Current Openings</Title>
      <Row gutter={[16, 16]}>
        {jobOpenings.map((job) => (
          <Col xs={24} sm={12} md={8} key={job.id}>
            <Card title={job.title} bordered={true}>
              <p><strong>Department:</strong> {job.department}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <Button type="primary">Apply Now</Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Career;
