import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTestMcqQuiz } from '../Redux/Slices/mcqSlice'; 
import { Card, Button, Row, Col, Spin, message, Tag } from 'antd';
import MCQTestQuestionModal from '../Modals/MCQTestQuestionModal';

const MCQTest = () => {
  const dispatch = useDispatch();
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
    <div style={{ padding: "24px" }}>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <Spin size="large" />
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
                }}
              >
                <p style={{ minHeight: '60px' }}>{quiz.description}</p>
                <Button 
                  style={{
                    backgroundColor: "#ffcc00",
                    color: "#333",
                    border: 'none',
                    width: '100%',
                    fontWeight: 'bold',
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
  );
};

export default MCQTest;
