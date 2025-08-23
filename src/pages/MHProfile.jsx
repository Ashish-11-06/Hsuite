// src/Components/MHProfile.jsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Avatar, Divider } from "antd";
import {
    UserOutlined,
    MailOutlined,
    CrownOutlined,
    TeamOutlined,
    FileTextOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const MHProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("medicalUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Title level={4}>No profile found</Title>
                <Text>Please login to view your profile.</Text>
            </div>
        );
    }

    return (
        <div style={{ background: "#f5f6fa", minHeight: "100vh", padding: "30px" }}>
            <Row justify="center">
                <Col xs={24} sm={22} md={20} lg={16}>
                    <Card
                        style={{
                            borderRadius: "15px",
                            overflow: "hidden",
                            paddingBottom: "30px",
                        }}
                        bodyStyle={{ padding: 0 }}
                    >
                        {/* Cover Banner */}
                        <div
                            style={{
                                height: "200px",
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1503264116251-35a269479413?fit=crop&w=1200&q=80')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                position: "relative",
                            }}
                        >
                            {/* Profile Info */}
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "-80px",
                                    left: "40px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Avatar size={100} icon={<UserOutlined />} />
                                <div style={{ marginLeft: "20px" }}>
                                    <div
                                        style={{
                                            fontSize: "22px",
                                            fontWeight: "bold",
                                            color: "black",
                                        }}
                                    >
                                        {user.first_name} {user.last_name}
                                    </div>
                                    <div style={{ fontSize: "16px", color: "black" }}>
                                        <MailOutlined style={{ marginRight: "8px" }} />
                                        {user.email || "No Email Provided"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Below */}
                        <div style={{ marginTop: "70px", padding: "20px" }}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Card title="My Stats" bordered={false}>
                                        <p>
                                            <TeamOutlined /> Followers: 120
                                        </p>
                                        <p>
                                            <CrownOutlined /> Wins: 3
                                        </p>
                                        <p>
                                            <FileTextOutlined /> Posts: 20
                                        </p>
                                    </Card>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Card title="Other Info" bordered={false}>
                                        <p>Role: {user.role || "N/A"}</p>
                                        <p>Phone: {user.phone || "N/A"}</p>
                                        <p>Address: {user.address || "N/A"}</p>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default MHProfile;



