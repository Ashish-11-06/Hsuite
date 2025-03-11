import React, { useEffect, useState } from "react";
import { Card, Typography, Layout, Row, Col, Spin, message } from "antd";
import codeAPIs from "../Redux/API/codeApi";

const { Title } = Typography;
const { Content } = Layout;

const Home = () => {
  const [bookCount, setBookCount] = useState(0);
  const [codeCount, setCodeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const booksResponse = await codeAPIs.getBooks();
        const codesResponse = await codeAPIs.getCodes();

        setBookCount(booksResponse.data.length);
        setCodeCount(codesResponse.data.length);
      } catch (error) {
        message.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Content style={{ padding: "10px" }}>
      <Row gutter={[10]} align="start">
        <Col>
          <Card
            style={{
              width: "200px",
              height: "150px",
              backgroundColor: "#fff", // White background
              color: "#000", // Black text
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              
              border: "2px solid #d9d9d9", // Styled border
              boxShadow: "2px 2px 10px rgba(0,0,0,0.1)", // Soft shadow
            }}
          >
            <Title level={5} style={{ color: "#000", fontSize: 20 }}>
              Books
            </Title>
            {loading ? (
              <Spin size="small" />
            ) : (
              <Title level={3} style={{ color: "#000" }}>{bookCount}</Title>
            )}
          </Card>
        </Col>

        <Col>
          <Card
            style={{
              width: "200px",
              height: "150px",
              backgroundColor: "#fff", // White background
              color: "#000", // Black text
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "2px solid #d9d9d9", // Styled border
              boxShadow: "2px 2px 10px rgba(0,0,0,0.1)", // Soft shadow
            }}
          >
            <Title level={5} style={{ color: "#000", fontSize: 20 }}>
              Codes
            </Title>
            {loading ? (
              <Spin size="small" />
            ) : (
              <Title level={3} style={{ color: "#000" }}>{codeCount}</Title>
            )}
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Home;
