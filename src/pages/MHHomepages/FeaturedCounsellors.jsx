import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Row, Col, Card, Typography, Button, Avatar, Spin } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { fetchAllCounsellors } from "../../Redux/Slices/CounsellorSlice";
import { BASE_URL } from "../../Redux/API/axiosInstance";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const FeaturedCounsellors = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [counsellors, setCounsellors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const resultAction = await dispatch(fetchAllCounsellors());
                if (fetchAllCounsellors.fulfilled.match(resultAction)) {
                    setCounsellors(resultAction.payload || []);
                }
            } catch (err) {
                console.error("Failed to load counsellors:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [dispatch]);

    const visibleCounsellors = counsellors.slice(startIndex, startIndex + 3);

    const handlePrev = () => {
        if (startIndex > 0) setStartIndex(startIndex - 1);
    };

    const handleNext = () => {
        if (startIndex + 3 < counsellors.length) setStartIndex(startIndex + 1);
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ marginTop: "60px", position: "relative" }}>
            <Title level={3}>Our Counsellors</Title>

            <Button
                shape="circle"
                icon={<LeftOutlined />}
                onClick={handlePrev}
                disabled={startIndex === 0}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "-40px",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                }}
            />
            <Button
                shape="circle"
                icon={<RightOutlined />}
                onClick={handleNext}
                disabled={startIndex + 3 >= counsellors.length}
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "-40px",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                }}
            />

            <Row gutter={[24, 24]} justify="center">
                {visibleCounsellors.map((c) => {
                    const profile = c.profile;
                    const photoUrl = profile?.photo
                        ? `${BASE_URL}${profile.photo}`
                        : null;
                    return (
                        <Col xs={24} md={8} key={c.id}>
                            <Card
                                hoverable
                                bordered
                                style={{ textAlign: "center", borderRadius: "12px" }}
                            >
                                <Avatar
                                    size={90}
                                    src={photoUrl}
                                    style={{
                                        backgroundColor: "#f0f0f0",
                                        marginBottom: "12px",
                                    }}
                                />
                                <Title level={4}>
                                    {profile?.first_name} {profile?.last_name}
                                </Title>
                                <Paragraph>
                                    <b>Experience:</b>{" "}
                                    {profile?.years_of_experience_months || 0} months
                                </Paragraph>
                                <Paragraph>
                                    <b>Education:</b>{" "}
                                    {profile?.educational_qualifications || "—"}
                                </Paragraph>
                                <Paragraph>
                                    <b>Current Post:</b> {profile?.current_post || "—"}
                                </Paragraph>
                                <Button type="primary" onClick={() => navigate("/medicalHealth/counsellor")}>Book Session</Button>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};

export default FeaturedCounsellors;
