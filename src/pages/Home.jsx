import React, { useEffect, useState } from "react";
import { Card, Typography, Layout, Row, Col, Spin, message } from "antd";
import {
  BookOutlined,
  CodeOutlined,
  TeamOutlined,
} from "@ant-design/icons"; // ✅ Importing icons
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import codeAPIs from "../Redux/API/codeApi";
import userAPI from "../Redux/API/userApi";

const { Title } = Typography;
const { Content } = Layout;

const Home = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const user_id = currentUser?.id;

  const [bookCount, setBookCount] = useState(0);
  const [codeCount, setCodeCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const booksResponse = await codeAPIs.getBooks();
        const codesResponse = await codeAPIs.getCodes(user_id);
        const usersResponse = await userAPI.getUsers();

        setBookCount(booksResponse.data.length);
        setCodeCount(codesResponse.data.length);
        setUserCount(usersResponse.data.length);
      } catch (error) {
        message.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, [user_id]);

  const cardStyle = {
    width: "200px",
    height: "150px",
    backgroundColor: "rgb(223, 246, 255)",
    color: "#000",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "2px solid rgb(172, 212, 255)",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
    cursor: "pointer",
  };

  const titleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: 20,
    color: "#000",
  };

  return (
    <Content style={{ padding: "10px" }}>
      <Row gutter={[10]} align="start">
        <Col>
          <Link to="/books">
            <Card style={cardStyle}>
              <Title level={5} style={titleStyle}>
                <BookOutlined /> Books
              </Title>
              {loading ? (
                <Spin size="small" />
              ) : (
                <Title level={3} style={{ color: "#000" }}>{bookCount}</Title>
              )}
            </Card>
          </Link>
        </Col>

        <Col>
          <Link to="/codes">
            <Card style={cardStyle}>
              <Title level={5} style={titleStyle}>
                <CodeOutlined /> Codes
              </Title>
              {loading ? (
                <Spin size="small" />
              ) : (
                <Title level={3} style={{ color: "#000" }}>{codeCount}</Title>
              )}
            </Card>
          </Link>
        </Col>

        {currentUser?.role === "Admin" && (
  <Col>
    <Link to="/users">
      <Card style={cardStyle}>
        <Title level={5} style={titleStyle}>
          <TeamOutlined /> Users
        </Title>
        {loading ? (
          <Spin size="small" />
        ) : (
          <Title level={3} style={{ color: "#000" }}>{userCount}</Title>
        )}
      </Card>
    </Link>
  </Col>
)}

      </Row>
    </Content>
  );
};

export default Home;
