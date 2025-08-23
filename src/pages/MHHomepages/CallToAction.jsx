// src/Components/CallToAction.jsx
import React, { useState } from "react";
import { Typography, Button, Card, Row, Col } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const topics = [
  {
    title: "Sleep & Restfulness",
    image:
      "https://media.post.rvohealth.io/wp-content/uploads/sites/3/2022/06/go_to_sleep_easily_732x549_thumb-732x549.jpg",
  },
  {
    title: "Overthinking Detox",
    image:
      "https://cdn-ilbffbh.nitrocdn.com/KlZFioVYcrbsnbuHVuaGOnGVBtqRmadn/assets/images/optimized/rev-692bf8c/simipsychologicalgroup.com/wp-content/uploads/2024/02/man-thinking-1080x675.jpg",
  },
  {
    title: "Reframing Negative Thoughts",
    image:
      "https://bayareacbtcenter.com/wp-content/uploads/2024/09/Untitled-design-358-1024x791.png",
  },
  {
    title: "Mindful Breathing",
    image:
      "https://media.post.rvohealth.io/wp-content/uploads/2019/02/Female_Sitting_Breathing_1200x628-facebook.jpg",
  },
  {
    title: "Gratitude Awareness",
    image:
      "https://images.squarespace-cdn.com/content/v1/656f4e4dababbd7c042c4946/a68505e0-92d3-4eb4-a9ce-f96c3776fb74/power-of-gratitude-3x2.jpg?w=600",
  },
  {
    title: "Grounding in the Present",
    image:
      "https://stablemassage.com.au/wp-content/uploads/2020/06/grounding-exercise-1024x683.jpg?w=600",
  },
];

const CallToAction = () => {
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handleNext = () => {
    if (startIndex + 3 < topics.length) setStartIndex(startIndex + 1);
  };

  const visibleTopics = topics.slice(startIndex, startIndex + 3);

  return (
    <div
      style={{
        marginTop: "60px",
        textAlign: "center",
        padding: "40px",
        background: "#fafafa",
        borderRadius: "12px",
        position: "relative",
      }}
    >
      <Title level={3}>Mindfulness Practices</Title>

      {/* Arrows */}
      <Button
        shape="circle"
        icon={<LeftOutlined />}
        onClick={handlePrev}
        disabled={startIndex === 0}
        style={{
          position: "absolute",
          top: "55%",
          left: "10px",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      />
      <Button
        shape="circle"
        icon={<RightOutlined />}
        onClick={handleNext}
        disabled={startIndex + 3 >= topics.length}
        style={{
          position: "absolute",
          top: "55%",
          right: "10px",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      />

      {/* Cards Row */}
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        {visibleTopics.map((topic, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              cover={
                <img
                  alt={topic.title}
                  src={topic.image}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                />
              }
              onClick={() => navigate("/medicalHealth/mindfulness")}
            >
              <Card.Meta title={topic.title} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CallToAction;
