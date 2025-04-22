import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Spin, Row, Col, Button, Modal, Radio } from "antd";
import { getQuizCategories, getTestQuestions } from "../Redux/Slices/quizSlice";
import QuizResultModal from "../Modals/QuizResultModal";

const QuizList = () => {
  const dispatch = useDispatch();
  const { quizList, loading: quizLoading, testQuestions } = useSelector((state) => state.quiz);

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(5);
  const timerRef = useRef(null);

  useEffect(() => {
    dispatch(getQuizCategories());
  }, [dispatch]);

  const handleTakeTest = (quizId) => {
    setSelectedQuizId(quizId);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    dispatch(getTestQuestions(quizId));
    setViewModalVisible(true);
  };

  const handleOptionChange = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const goToNextQuestion = () => {
    if (Array.isArray(testQuestions) && currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSecondsLeft(5);
    } else {
      clearInterval(timerRef.current);
      setViewModalVisible(false);
      setResultModalVisible(true);
    }
  };

  // Timer logic
  useEffect(() => {
    if (viewModalVisible && Array.isArray(testQuestions) && testQuestions.length > 0) {
      setSecondsLeft(5); // reset timer on new question
      clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 1) {
            clearInterval(timerRef.current);
            goToNextQuestion();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current); // cleanup on unmount
  }, [currentQuestionIndex, viewModalVisible, testQuestions]);

  const currentQuestion = Array.isArray(testQuestions) ? testQuestions[currentQuestionIndex] : null;

  // Styling from Assessments component
  const cardStyle = {
    width: 600,
    height: 300,
    marginTop: "5px",
    color: "black",
    borderRadius: 12,
    padding: 20,
    textAlign: "center",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
    border: "1px solid #ade2f8",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 1)",
      borderColor: "#5cb3ff",
    }
  };

  const buttonStyle = {
    backgroundColor: "#ffcc00",
    color: "#333",
    fontWeight: "bold",
    border: "none",
    borderRadius: 5,
    padding: "8px 15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    ":hover": {
      backgroundColor: "#ffd633",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      color: "#000"
    },
    ":active": {
      transform: "translateY(0)",
      boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)"
    }
  };

  const listStyle = {
    textAlign: "left",
    fontSize: 14,
    paddingLeft: 15,
  };

  const timerStyle = {
    color: "red",
    fontWeight: "bold",
  };

  // Circle dot indicator
  const renderDots = () => {
    if (!Array.isArray(testQuestions)) return null;
    return (
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        {testQuestions.map((_, index) => (
          <div
            key={index}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              margin: "0 4px",
              backgroundColor: index === currentQuestionIndex ? "#1890ff" : "#ccc",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ width: "100%", marginBottom: "16px" }}>
      {quizLoading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]} justify="start">
          {quizList?.map((quiz) => (
            <Col key={quiz.id} 
            xs={24} sm={12} md={8} lg={6}
            >
              <Card
                title={quiz.quiz_name}
                bordered={false}
                style={{
                  ...cardStyle,
                  width: 300, // Slightly narrower than assessment cards
                  height: 200, // Slightly shorter
                }}
                hoverable
              >
                <Button
                  type="primary"
                  onClick={() => handleTakeTest(quiz.id)}
                  style={buttonStyle}
                >
                  Take Test
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Quiz Modal */}
      <Modal
        title={`Question ${currentQuestionIndex + 1}`}
        open={viewModalVisible}
        onCancel={() => {
          clearInterval(timerRef.current);
          setViewModalVisible(false);
        }}
        footer={[
          <div style={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: "column" }} key="footer">
            {renderDots()}
            <Button 
              type="primary" 
              onClick={goToNextQuestion} 
              style={{ 
                ...buttonStyle,
                marginTop: "16px", 
                alignSelf: "flex-end",
                backgroundColor: "#1890ff",
                ":hover": {
                  backgroundColor: "#40a9ff",
                }
              }}
            >
              {Array.isArray(testQuestions) && currentQuestionIndex === testQuestions.length - 1
                ? "Finish"
                : "Next"}
            </Button>
          </div>,
        ]}
        width={600}
        styles={{
          body: {
            maxHeight: "70vh",
            overflowY: "auto",
          },
        }}
      >
        {currentQuestion ? (
          <div>
            <h3>{currentQuestion.question}</h3>
            <p style={timerStyle}>
              Time left: {secondsLeft} sec
            </p>
            <Radio.Group
              onChange={(e) => handleOptionChange(currentQuestion.id, e.target.value)}
              value={selectedAnswers[currentQuestion.id]}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Radio value="option_1" style={{ marginBottom: "10px" }}>A. {currentQuestion.option_1}</Radio>
              <Radio value="option_2" style={{ marginBottom: "10px" }}>B. {currentQuestion.option_2}</Radio>
              {currentQuestion.option_3 && (
                <Radio value="option_3" style={{ marginBottom: "10px" }}>C. {currentQuestion.option_3}</Radio>
              )}
              {currentQuestion.option_4 && (
                <Radio value="option_4" style={{ marginBottom: "10px" }}>D. {currentQuestion.option_4}</Radio>
              )}
            </Radio.Group>
          </div>
        ) : (
          <p>No questions available.</p>
        )}
      </Modal>

      {/* Result Modal */}
      <QuizResultModal
        visible={resultModalVisible}
        onClose={() => setResultModalVisible(false)}
        questions={testQuestions}
        selectedAnswers={selectedAnswers}
      />
    </div>
  );
};

export default QuizList;