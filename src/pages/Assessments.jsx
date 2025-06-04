import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import QuizList from "./QuizList";
import { Card, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const Assessments = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("quiz");
    const navigate = useNavigate();

  return (
    <>
    <div style={{ position: "relative", margin: "-18px" }}>
    <Button
      icon={<ArrowLeftOutlined />}
      type="primary"
      onClick={() => navigate(-1)}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        // fontSize: "40px",
        color: "white",
      }}
    >Back</Button>
  </div>
    <div style={{ padding: "50px" }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <Card
          title="Personality test Instructions"
          bordered={true}
          style={{
            width: '100%',
            maxWidth: '800px',
            border: '1px solid #1890ff',
            borderRadius: '8px',
            backgroundColor: '#e6f7ff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <ul style={{ display: 'inline-block', textAlign: 'left', paddingLeft: '20px', marginBottom: 0 }}>
              <li>There are <strong>two types of tests</strong>: <strong>Question-based</strong> and <strong>Statement-based</strong>.</li>
              <li>In <strong>Question-based tests</strong>, each question has <strong>4 options</strong>. You must select only one.</li>
              <li>In <strong>Statement-based tests</strong>, there are <strong>2 statements</strong> per item. You need to select the one that best fits you.</li>
              <li>The test consists of <strong>20 items</strong>.</li>
              <li>Each item has a <strong>timer of 10 seconds</strong>.</li>
              <li>At the end of the test, <strong>results will be shown</strong>.</li>
              <li>You can <strong>retake the test</strong> if you want.</li>
            </ul>
          </div>
        </Card>

      </div>

      {activeTab === "quiz" && <QuizList />}
    </div>
    </>
  );
};

export default Assessments;
