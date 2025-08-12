// src/components/Footer.jsx
import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ backgroundColor: '#f0f2f5', padding: '40px 20px' }}>
      <Row gutter={[32, 32]}>
        {/* Hospital Info */}
        <Col xs={24} sm={12} md={8}>
          <Title level={4}>HSuite Hospital</Title>
          <Text>
            A state-of-the-art medical facility providing high-quality patient care.
          </Text>
        </Col>

        {/* Quick Links */}
        <Col xs={24} sm={12} md={8}>
          <Title level={5}>Quick Links</Title>
          <Space direction="vertical">
            <Link href="/web/">Home</Link>
            <Link href="/web/specialities">Specialities</Link>
            <Link href="/web/careers">Careers</Link>
            <Link href="/web/contact">Contact Us</Link>
          </Space>
        </Col>

        {/* Contact Info */}
        <Col xs={24} sm={24} md={8}>
          <Title level={5}>Contact</Title>
          <Space direction="vertical">
            <Text>Email: contact@hsuitehospital.com</Text>
            <Text>Phone: +91 98765 43210</Text>
            <Text>Address: 123 Health Lane, MedCity, India</Text>
          </Space>
        </Col>
      </Row>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Text type="secondary">
          © {new Date().getFullYear()} HSuite Hospital. All rights reserved.
        </Text>
      </div>
    </AntFooter>
  );
};

export default Footer;
