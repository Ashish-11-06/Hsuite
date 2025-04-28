import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllQuizzes } from '../Redux/Slices/mcqSlice'; 
import { Card, Button, Row, Col, Spin, message } from 'antd';
import MCQTestQuestionModal from '../Modals/MCQTestQuestionModal'; // ✅ import modal

const MCQTest = () => {
  const dispatch = useDispatch();
  const { quizzes, loading, error } = useSelector((state) => state.mcq);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // to know which quiz is clicked

  useEffect(() => {
    dispatch(getAllQuizzes());
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
                <>
                  <div>{quiz.name}</div>
                  <div style={{ fontSize: '12px', color: 'gray' }}>
                    ({quiz.type})
                  </div>
                </>
              }
              bordered={false}
              style={{ height: '100%' }}
            >
              <p>{quiz.description}</p>
              <Button type="primary" onClick={() => handleTakeTest(quiz)}>
                Take Test
              </Button>
            </Card>
          </Col>
        ))}
      </Row>      
      )}

      {/* Modal to show quiz details */}
      <MCQTestQuestionModal
        open={isModalOpen}
        onClose={handleCloseModal}
        quizData={selectedQuiz}
      />
    </div>
  );
};

export default MCQTest;
