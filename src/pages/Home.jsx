import React, { useEffect, useState } from "react";
import { Card, Typography, Layout, Row, Col, Spin, message } from "antd";
import {
  BookOutlined,
  CodeOutlined,
  TeamOutlined,
  ReadOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../Redux/Slices/authSlice";

const { Title } = Typography;
const { Content } = Layout;

const Home = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    books_count: 0,
    codes_count: 0,
    total_users_count: 0,
    counsellors_count: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const result = await dispatch(getDashboardStats()).unwrap();
        setStats(result); // result will be your API response
      } catch (err) {
        message.error(err?.message || "Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [dispatch]);

  const cardStyle = {
    width: "100%",
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
    <Content
      style={{
        position: "relative",
        minHeight: "calc(100vh - 60px)",
        overflowX: "hidden"
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url("https://thevillageshealth.com/wp-content/uploads/2020/12/Mindfulness-1.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.6)",
          zIndex: 0,
        }}
      />

      {/* Foreground */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "20px",
          height: "100%",
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Books */}
          <Col xs={12} sm={8} md={6} lg={4}>
            <Link to="/books">
              <Card style={cardStyle}>
                <Title level={5} style={titleStyle}>
                  <BookOutlined /> Books
                </Title>
                {loading ? (
                  <Spin size="small" />
                ) : (
                  <Title level={3} style={{ color: "#000" }}>
                    {stats.books_count}
                  </Title>
                )}
              </Card>
            </Link>
          </Col>

          {/* Codes */}
          <Col xs={12} sm={8} md={6} lg={4}>
            <Link to="/codes">
              <Card style={cardStyle}>
                <Title level={5} style={titleStyle}>
                  <CodeOutlined /> Codes
                </Title>
                {loading ? (
                  <Spin size="small" />
                ) : (
                  <Title level={3} style={{ color: "#000" }}>
                    {stats.codes_count}
                  </Title>
                )}
              </Card>
            </Link>
          </Col>

          {/* Assessments */}
          <Col xs={12} sm={8} md={6} lg={4}>
            <Link to="/assessment">
              <Card style={cardStyle}>
                <Title level={5} style={titleStyle}>
                  <ReadOutlined /> Assessments
                </Title>
              </Card>
            </Link>
          </Col>

          {/* Counsellors */}
          <Col xs={12} sm={8} md={6} lg={4}>
            <Link to="/counsellor">
              <Card style={cardStyle}>
                <Title level={5} style={titleStyle}>
                  <UsergroupAddOutlined /> Counsellors
                </Title>
                {loading ? (
                  <Spin size="small" />
                ) : (
                  <Title level={3} style={{ color: "#000" }}>
                    {stats.counsellors_count}
                  </Title>
                )}
              </Card>
            </Link>
          </Col>

          {/* Users (Admin only) */}
          {currentUser?.role === "Admin" && (
            <Col xs={12} sm={8} md={6} lg={4}>
              <Link to="/users">
                <Card style={cardStyle}>
                  <Title level={5} style={titleStyle}>
                    <TeamOutlined /> Users
                  </Title>
                  {loading ? (
                    <Spin size="small" />
                  ) : (
                    <Title level={3} style={{ color: "#000" }}>
                      {stats.total_users_count}
                    </Title>
                  )}
                </Card>
              </Link>
            </Col>
          )}
        </Row>
      </div>
    </Content>
  );
};

export default Home;
