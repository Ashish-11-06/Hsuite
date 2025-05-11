import React from "react";
import { Card, Row, Col, Typography, Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const Assessment = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const handleSelect = (value) => {
    navigate(value);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Assessments</Title>
      <Row gutter={[24, 24]}>
        {/* Personality Test */}
        <Col xs={24} md={8}>
          <Card title="Personality Test" bordered={false}>
            <Select
              placeholder="Select Action"
              style={{ width: "100%" }}
              onChange={handleSelect}
            >
              {userRole === "Admin" &&(
                <Option value="/createset">Create Set</Option>
                )}
              <Option value="/assessents">Take Test</Option>
              <Option value="/report">View Report</Option>
            </Select>
          </Card>
        </Col>

        {/* MCQ Test */}
        <Col xs={24} md={8}>
          <Card title="MCQ Test" bordered={false}>
            <Select
              placeholder="Select Action"
              style={{ width: "100%" }}
              onChange={handleSelect}
            >
              {userRole === "Admin" &&(
              <Option value="/createmcq">Create MCQ</Option>
              )}
              <Option value="/mcqtest">Take Test</Option>
              <Option value="/mcqreport">View Report</Option>
            </Select>
          </Card>
        </Col>

        {/* Egogram Test */}
        <Col xs={24} md={8}>
          <Card title="Egogram Test" bordered={false}>
            <Select
              placeholder="Select Action"
              style={{ width: "100%" }}
              onChange={handleSelect}
            >
              {userRole === "Admin" &&(
              <Option value="/createegogram">Create Egogram</Option>
              )}
              <Option value="/testegogram">Take Test</Option>
              <Option value="/egogramreport">View Report</Option>
            </Select>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Assessment;
