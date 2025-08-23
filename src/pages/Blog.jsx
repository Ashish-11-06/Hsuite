// src/Components/Blog.jsx
import React from "react";
import { Card, Row, Col, Typography } from "antd";
import {
  BookOutlined,
  ReadOutlined,
  HeartOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Blog = () => {
  const articles = [
    {
      title: "Why Mental Health is Important",
      description:
        "Mental health affects how we think, feel, and behave in daily life. It also impacts our relationships, productivity, and physical health.",
      link: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
      icon: <HeartOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
    },
    {
      title: "How to Recognize Mental Health Issues",
      description:
        "Signs include constant stress, lack of sleep, loss of interest in activities, mood swings, or feeling isolated.",
      link: "https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/signs-good-and-poor-mental-health",
      icon: <ReadOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
    },
    {
      title: "Tips to Improve Mental Wellbeing",
      description:
        "Regular exercise, meditation, good sleep, talking to friends, and seeking professional help can make a big difference.",
      link: "https://www.nhs.uk/mental/mental-health/self-care/tips-and-support/",
      icon: <BookOutlined style={{ fontSize: "24px", color: "#faad14" }} />,
    },
  ];

  const videos = [
    {
      title: "How to Improve Your Mental Health",
      url: "https://www.youtube.com/embed/ZbZSe6N_BXs",
    },
    {
      title: "Understanding Anxiety and Stress",
      url: "https://www.youtube.com/embed/WWloIAQpMcQ",
    },
    {
      title: "Meditation for Mental Wellbeing",
      url: "https://www.youtube.com/embed/inpok4MKVLM",
    },
  ];

  return (
    <div style={{ padding: "40px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
         Mental Health Blog
      </Title>

      {/* Articles Section */}
      <Title level={3} style={{ margin: "20px 0" }}>
        Articles & Resources
      </Title>
      <Row gutter={[24, 24]}>
        {articles.map((article, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              style={{ borderRadius: "12px", height: "100%" }}
              title={article.icon}
            >
              <Title level={4}>{article.title}</Title>
              <Paragraph>{article.description}</Paragraph>
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                Read More →
              </a>
            </Card>
          </Col>
        ))}
      </Row>

      {/* YouTube Section */}
      <Title level={3} style={{ margin: "40px 0 20px" }}>
         Helpful Videos
      </Title>
      <Row gutter={[24, 24]}>
        {videos.map((video, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              cover={
                <iframe
                  width="100%"
                  height="200"
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: "12px" }}
                ></iframe>
              }
            >
              <Title level={4}>{video.title}</Title>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Blog;
