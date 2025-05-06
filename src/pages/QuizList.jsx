import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Spin, Row, Col, Button, Modal, Radio, Tag } from "antd";
import { getQuizName, getTestQuestions } from "../Redux/Slices/quizSlice";
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
  const [selectedQuizType, setSelectedQuizType] = useState(""); // <-- NEW
  const [randomOptions, setRandomOptions] = useState([]); // <-- NEW

  useEffect(() => {
    dispatch(getQuizName());
  }, [dispatch]);

  const handleTakeTest = (quizId) => {
    const quiz = quizList.find((q) => q.id === quizId);
    setSelectedQuizId(quizId);
    setSelectedQuizType(quiz?.type || ""); 
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
      setSecondsLeft(10);
  
      if (selectedQuizType === "statement-based" && testQuestions[currentQuestionIndex + 1]) {
        const twoOptions = getRandomTwoOptions(testQuestions[currentQuestionIndex + 1]);
        setRandomOptions(twoOptions);
      }
    } else {
      clearInterval(timerRef.current);
      setViewModalVisible(false);
      setResultModalVisible(true);
    }
  };

  const getRandomTwoOptions = (question) => {
    const options = [];
    if (question.option_1) options.push({ key: "option_1", value: question.option_1 });
    if (question.option_2) options.push({ key: "option_2", value: question.option_2 });
    if (question.option_3) options.push({ key: "option_3", value: question.option_3 });
    if (question.option_4) options.push({ key: "option_4", value: question.option_4 });
  
    const shuffled = options.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  };

  // Timer logic
  useEffect(() => {
    if (viewModalVisible && Array.isArray(testQuestions) && testQuestions.length > 0) {
      setSecondsLeft(10); // reset timer on new question
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
      if (selectedQuizType === "statement-based" && testQuestions[currentQuestionIndex]) {
        const twoOptions = getRandomTwoOptions(testQuestions[currentQuestionIndex]);
        setRandomOptions(twoOptions);
      }      
    }

    return () => clearInterval(timerRef.current); // cleanup on unmount
  }, [currentQuestionIndex, viewModalVisible, testQuestions]);

  const currentQuestion = Array.isArray(testQuestions) ? testQuestions[currentQuestionIndex] : null;

  // Helper function for quiz type
  const getTypeTag = (type) => {
    const lowerType = type?.toLowerCase();
    if (lowerType === 'question-based') return <Tag color="blue">QUESTION BASED</Tag>;
    if (lowerType === 'statement-based') return <Tag color="volcano">STATEMENT BASED</Tag>;
    return <Tag>UNKNOWN</Tag>;
  };

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
    <div style={{ padding: "24px" }}>
      {quizLoading ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {quizList?.map((quiz) => (
            <Col key={quiz.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={
                  <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {quiz.quiz_name}
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
                <p
                  style={{
                    minHeight: '60px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3, // Limit to 3 lines
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {quiz.quiz_description}
                </p>
                <Button
                  style={{
                    backgroundColor: "#ffcc00",
                    color: "#333",
                    border: 'none',
                    width: '100%',
                    fontWeight: 'bold',
                  }}
                  onClick={() => handleTakeTest(quiz.id)}
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
    <div
      key="footer"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "12px 24px",
      }}
    >
      <div style={{ marginBottom: "12px", textAlign: "center" }}>
        {renderDots()}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          onClick={goToNextQuestion}
          style={{ backgroundColor: "#1890ff", padding: "10px" }}
          size="medium"
        >
          {Array.isArray(testQuestions) &&
          currentQuestionIndex === testQuestions.length - 1
            ? "Finish"
            : "Next"}
        </Button>
      </div>
    </div>,
  ]}
  width={600}
>
  {currentQuestion ? (
    <div>
      <h3>{currentQuestion.question}</h3>
      <p style={{ color: "red", fontWeight: "bold" }}>
        Time left: {secondsLeft} sec
      </p>
      {selectedQuizType === "statement-based" ? (
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          {randomOptions.map((option) => (
            <Card
              key={option.key}
              onClick={() =>
                handleOptionChange(currentQuestion.id, option.key)
              }
              style={{
                border:
                  selectedAnswers[currentQuestion.id] === option.key
                    ? "2px solid #1890ff"
                    : "1px solid #ccc",
                cursor: "pointer",
                padding: "10px",
                textAlign: "center",
                backgroundColor:
                  selectedAnswers[currentQuestion.id] === option.key
                    ? "#e6f7ff"
                    : "#fff",
                borderRadius: 8,
                width: "45%",
              }}
              hoverable
            >
              {option.value}
            </Card>
          ))}
        </div>
      ) : (
        <Radio.Group
          onChange={(e) =>
            handleOptionChange(currentQuestion.id, e.target.value)
          }
          value={selectedAnswers[currentQuestion.id]}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Radio value="option_1" style={{ marginBottom: "10px" }}>
            A. {currentQuestion.option_1}
          </Radio>
          <Radio value="option_2" style={{ marginBottom: "10px" }}>
            B. {currentQuestion.option_2}
          </Radio>
          {currentQuestion.option_3 && (
            <Radio value="option_3" style={{ marginBottom: "10px" }}>
              C. {currentQuestion.option_3}
            </Radio>
          )}
          {currentQuestion.option_4 && (
            <Radio value="option_4" style={{ marginBottom: "10px" }}>
              D. {currentQuestion.option_4}
            </Radio>
          )}
        </Radio.Group>
      )}
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
