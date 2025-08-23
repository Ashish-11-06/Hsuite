import React from "react";
import { Layout, Row, Col, Typography, Input, Button } from "antd";
import {
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
  LinkedinFilled,
  YoutubeFilled,
  PhoneOutlined,
  MessageOutlined,
  GlobalOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  BookOutlined,
  ReadOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link as RouterLink } from "react-router-dom"; // ✅ React Router link

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const MHFooter = () => {
  return (
    <Footer
      style={{
        background: "#1e3a8a", // solid blue background
        color: "#fff",
        padding: "50px 80px",
        borderRadius: "20px 20px 0 0",
      }}
    >
      <Row gutter={[40, 30]}>
        {/* Quick Links */}
        <Col xs={24} sm={12} md={6}>
          <Title
            level={4}
            style={{
              color: "#fff",
              borderBottom: "2px solid #3b82f6",
              paddingBottom: "5px",
            }}
          >
            Quick Links
          </Title>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { name: "Home", path: "/medicalHealth" },
              { name: "Assessments", path: "/medicalHealth/assessment" },
              { name: "Predefined Treaatment", path: "/medicalHealth/treatment" },
              { name: "Counsellors", path: "/medicalHealth/counsellor" },
              { name: "Counsellor Treatment", path: "/medicalHealth/counsellortreatment" },
              { name: "Ongoing Counsellor Treatment", path: "/medicalHealth/ongocountreatment" },
              { name: "Mindfulness", path: "/medicalHealth/mindfulness" },
              { name: "Blog", path: "/blog" },
              { name: "Profile", path: "/medicalHealth/profile" },
            ].map((link, i) => (
              <li key={i} style={{ marginBottom: "8px" }}>
                <RightOutlined style={{ marginRight: "8px" }} />
                <RouterLink to={link.path} style={{ color: "#cbd5e1" }}>
                  {link.name}
                </RouterLink>
              </li>
            ))}
          </ul>
        </Col>

        {/* Resources */}
        <Col xs={24} sm={12} md={6}>
          <Title
            level={4}
            style={{
              color: "#fff",
              borderBottom: "2px solid #3b82f6",
              paddingBottom: "5px",
            }}
          >
            Resources
          </Title>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <BookOutlined style={{ marginRight: "8px" }} /> Self-Help Guides
            </li>
            <li>
              <VideoCameraOutlined style={{ marginRight: "8px" }} /> Meditation
              Videos
            </li>
            <li>
              <FileTextOutlined style={{ marginRight: "8px" }} /> Worksheets
            </li>
            <li>
              <ReadOutlined style={{ marginRight: "8px" }} /> Podcasts
            </li>
            <li>
              <BookOutlined style={{ marginRight: "8px" }} /> Recommended Books
            </li>
          </ul>
        </Col>

        {/* Emergency Contacts */}
        <Col xs={24} sm={12} md={6}>
          <Title
            level={4}
            style={{
              color: "#fff",
              borderBottom: "2px solid #3b82f6",
              paddingBottom: "5px",
            }}
          >
            Emergency Contacts
          </Title>
          <p>
            <PhoneOutlined style={{ marginRight: "8px" }} />
            <strong>Crisis Hotline</strong>
            <br />
            1-800-273-8255
          </p>
          <p>
            <MessageOutlined style={{ marginRight: "8px" }} />
            <strong>Crisis Text Line</strong>
            <br />
            Text HOME to 741741
          </p>
          <p>
            <GlobalOutlined style={{ marginRight: "8px" }} />
            <strong>
              International Association for Suicide Prevention
            </strong>
            <br />
            <Link href="#" style={{ color: "#3b82f6" }}>
              Find a Helpline
            </Link>
          </p>
        </Col>

        {/* Stay Connected */}
        <Col xs={24} sm={12} md={6}>
          <Title
            level={4}
            style={{
              color: "#fff",
              borderBottom: "2px solid #3b82f6",
              paddingBottom: "5px",
            }}
          >
            Stay Connected
          </Title>
          <p>Subscribe to our newsletter for mental health tips and updates.</p>
          <Input
            placeholder="Your Email Address"
            style={{
              marginBottom: "10px",
              background: "#334155",
              color: "#fff",
            }}
          />
          <Button
            type="primary"
            block
            style={{ background: "#3b82f6", border: "none" }}
          >
            Subscribe
          </Button>
          <div style={{ marginTop: "15px", fontSize: "20px" }}>
            <FacebookFilled style={{ marginRight: "10px" }} />
            <TwitterSquareFilled style={{ marginRight: "10px" }} />
            <InstagramFilled style={{ marginRight: "10px" }} />
            <LinkedinFilled style={{ marginRight: "10px" }} />
            <YoutubeFilled />
          </div>
        </Col>
      </Row>

      <hr style={{ margin: "30px 0", borderColor: "#475569" }} />

      <Row justify="center">
        <Col style={{ textAlign: "center", color: "#cbd5e1" }}>
          © 2023 Mental Health Matters. All rights reserved. |{" "}
          <Link href="#" style={{ color: "#cbd5e1" }}>
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link href="#" style={{ color: "#cbd5e1" }}>
            Terms of Service
          </Link>
          <br />
          <Text style={{ fontSize: "12px", color: "#94a3b8" }}>
            Disclaimer: This website does not provide medical advice. The
            content is for informational purposes only.
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};

export default MHFooter;
