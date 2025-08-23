import React from "react";
import { useLocation } from "react-router-dom";
import { Card, Row, Col } from "antd";

const MindVideo = () => {
  const location = useLocation();
  const { videoUrl, title, description } = location.state || {};

  if (!videoUrl) {
    return <h2 style={{ textAlign: "center" }}>No video selected!</h2>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>{title}</h1>

      <Row gutter={[24, 24]} justify="center" align="top">
        {/* Left Side: Video */}
        <Col xs={24} md={14}>
          <Card>
            <iframe
              width="100%"
              height="450"
              src={videoUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Card>
        </Col>

        {/* Right Side: Description */}
        <Col xs={24} md={10}>
          <Card title="Key Practices" bordered={false}>
            <ul style={{ lineHeight: "1.8em", paddingLeft: "20px" }}>
              {description?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MindVideo;
