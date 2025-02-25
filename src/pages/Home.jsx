import React from "react";
import { Card, Button, Typography, Layout, Row, Col } from "antd";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const Home = () => {
  return (
    <Content style={{ padding: "20px" }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card
            title={
              <Title level={2} style={{ textAlign: "center" }}>
                Welcome to the Home Page
              </Title>
            }
            variant='borderless'
            style={{ width: "100%" }}
          >
           
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Home;