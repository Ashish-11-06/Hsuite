import React from 'react';
import { Typography, Form, Input, Button, Row, Col } from 'antd';
import '../Styles/ContactUs.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ContactUs = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  return (
    <div className="contact-container">
      <Title level={2} className="contact-title">Contact Us</Title>
      <Paragraph className="contact-paragraph">
        We are here to help you 24/7. Reach out with your questions, feedback, or concerns.
      </Paragraph>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <div className="contact-info">
            <Paragraph><strong>Phone:</strong> +91 98765 43210</Paragraph>
            <Paragraph><strong>Email:</strong> contact@hsuitehospital.com</Paragraph>
            <Paragraph><strong>Address:</strong> 123 HSuite Medical Lane, Pune, Maharashtra</Paragraph>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="contact-form">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="name" label="Your Name" rules={[{ required: true }]}>
                <Input placeholder="Enter your name" />
              </Form.Item>

              <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item name="message" label="Your Message" rules={[{ required: true }]}>
                <TextArea rows={4} placeholder="Write your message" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">Send Message</Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>

    </div>
  );
};

export default ContactUs;
