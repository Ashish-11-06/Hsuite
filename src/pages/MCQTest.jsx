import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getTestMcqQuiz } from '../Redux/Slices/mcqSlice'; 
import { Card, Button, Row, Col, Spin, message, Tag } from 'antd';
import { PlayCircleOutlined, ArrowLeftOutlined  } from "@ant-design/icons"; 
import MCQTestQuestionModal from '../Modals/MCQTestQuestionModal';

const MCQTest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quiz: quizzes, loading, error } = useSelector((state) => state.mcq);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    dispatch(getTestMcqQuiz());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleTakeTest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  const getTypeTag = (type) => {
    const lowerType = type?.toLowerCase();
    if (lowerType === 'multiple-choice') return <Tag color="blue">MULTIPLE-CHOICE</Tag>;
    if (lowerType === 'single-choice') return <Tag color="volcano">SINGLE-CHOICE</Tag>;
    return <Tag>UNKNOWN</Tag>;
  };

  return (
    <>
     <div style={{ position: "relative", margin: "20px" }}>
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
      {/* Instruction Card */}
      <Card
        title="MCQ Test Instructions"
        bordered={true}
        style={{
          maxWidth: '900px',
          margin: '0 auto 32px auto',
          border: '1px solid #1890ff',
          borderRadius: '8px',
          backgroundColor: '#e6f7ff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <ul style={{ display: 'inline-block', textAlign: 'left', paddingLeft: '20px', marginBottom: 0 }}>
            <li><strong>There are two types of MCQ tests:</strong></li>
            <ul>
              <li><strong>Multiple-choice</strong>: You can select more than one answer if applicable, testing your comprehensive understanding.</li>
              <li><strong>Single-choice</strong>: You must choose the one correct option that best answers the question.</li>
            </ul>
            <li>Each test consists of <strong>20 questions</strong>.</li>
            <li>Each question has a <strong>timer of 10 seconds</strong>.</li>
            <li>At the end of the test, <strong>your result will be shown</strong>.</li>
            <li><strong>Each answer is scored</strong> based on your selection.</li>
            <li>You can <strong>retake the test</strong> as many times as you want.</li>
          </ul>
        </div>
      </Card>

      {/* Test Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <Spin size="large" />
        </div>
      ) : quizzes.length === 0 ? (
        <div
          style={{
            border: '2px dashed #d9d9d9',
            padding: '60px',
            textAlign: 'center',
            borderRadius: '12px',
            backgroundColor: '#fafafa',
          }}
        >
          <p style={{ fontSize: '18px', color: '#888' }}>
            No tests are available.
          </p>
          <p style={{ fontSize: '14px', color: '#aaa', marginTop: '10px' }}>
            Please check back later for new tests.
          </p>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {quizzes.map((quiz) => (
            <Col key={quiz.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={
                  <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {quiz.name}
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      {getTypeTag(quiz.type)}
                    </div>
                  </div>
                }
                bordered={true}
                style={{
                  height: '100%',
                  border: '1px solid #1890ff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                bodyStyle={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  padding: '16px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ minHeight: '60px' }}>{quiz.description}</p>
                </div>
                <Button 
                  icon={<PlayCircleOutlined />}
                  style={{
                    backgroundColor: "#ffcc00",
                    color: "#333",
                    border: 'none',
                    width: '100%',
                    fontWeight: 'bold',
                    marginTop: 'auto',
                  }}
                  onClick={() => handleTakeTest(quiz)}
                >
                  Take Test
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <MCQTestQuestionModal
        open={isModalOpen}
        onClose={handleCloseModal}
        quizData={selectedQuiz}
      />
    </div>
    </>
  );
};

export default MCQTest;
