import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveResult, fetchMultipleChoiceQuestions, fetchStatementBasedQuestions, setResponses, clearResponses } from "../Redux/Slices/assessmentSlice";
import { Modal, Button, Radio, Card, Row, Col } from "antd";
import QuizList from "./QuizList";
import { useResults } from "./Results"; // Import the useResults hook

const Assessments = () => {
  const dispatch = useDispatch();
  const { multipleChoiceQuestions, statementBasedQuestions, loading } = useSelector((state) => state.assessments);
  const loggedInUserId = 1;
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const responses = useSelector((state) => state.assessments?.responses || []);
  const [timeLeft, setTimeLeft] = useState(10); // Timer for 7 seconds
  const timerRef = useRef(null); // Store timer ID
  const [testType, setTestType] = useState("");
  const [activeTab, setActiveTab] = useState("quiz");
  const [isShowResultsEnabled, setIsShowResultsEnabled] = useState(false);
  // const { quizCategories, loading: quizLoading } = useSelector((state) => state.quiz);
  // const quizState = useSelector((state) => state.quiz);
  

  // Use the useResults hook
  const { resultData, 
    isResultModalOpen, setIsResultModalOpen, handleShowResults, ResultsModal } = useResults(
    loggedInUserId,
    responses,
    currentQuestions,
    testType,
    multipleChoiceQuestions,
    statementBasedQuestions,
    setIsModalOpen 
  );

  useEffect(() => {
    // console.log("isShowResultsEnabled:", isShowResultsEnabled);
  }, [isShowResultsEnabled]);  
  useEffect(() => {
    if (currentIndex + 1 === currentQuestions.length) {
      setIsShowResultsEnabled(true);
    } else {
      setIsShowResultsEnabled(false); // Ensure it's disabled while the test is ongoing
    }
  }, [currentIndex, currentQuestions.length]);

  useEffect(() => {
     dispatch(fetchMultipleChoiceQuestions());
    dispatch(fetchStatementBasedQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (!isModalOpen || !currentQuestions.length) return;
  
    setTimeLeft(10);
    setSelectedAnswer(responses[currentIndex]?.selectedOption || null);
  
    startTimer();
  
    return () => clearInterval(timerRef.current);
  }, [currentIndex, isModalOpen]);
  
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  
    setTimeLeft(5);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  useEffect(() => {
  }, [currentIndex, selectedAnswer, timeLeft, responses]);

  const handleOpenModal = (type) => {
    dispatch(clearResponses());
    const normalizedType = type === "multiple-choice" ? "mcq" : type;
  setTestType(normalizedType);

    let allQuestions;
    if (type === "multiple-choice") {
      allQuestions = multipleChoiceQuestions.map((question) => ({
        ...question,
        options: [
          question.logical,
          question.analytical,
          question.strategic,
          question.thinking,
        ],
      }));
    } else {
      if (!statementBasedQuestions || !Array.isArray(statementBasedQuestions.options)) {
        // console.error("statementBasedQuestions is not in the expected format:", statementBasedQuestions);
        return;
      }

      allQuestions = statementBasedQuestions.options.map((question) => {
        const allStatements = [
          question.logical,
          question.analytical,
          question.strategic,
          question.thinking,
        ].filter(Boolean); // Filter out any undefined/null values
        
        // Shuffle and pick 2 random statements
        const shuffled = [...allStatements].sort(() => 0.5 - Math.random());
        const selectedStatements = shuffled.slice(0, 2);
        return {
          ...question,
          statements: selectedStatements,
      };
    });
    }

    // console.log("All Questions:", allQuestions);
    setCurrentQuestions(allQuestions);
    setCurrentIndex(0);
    setIsModalOpen(true);
    setSelectedAnswer(null);
    startTimer();
  };

const handleAnswerSelect = (e) => {
  const selectedValue = e.target.value;
  setSelectedAnswer(selectedValue);
  
  // Create and dispatch the response immediately
  const newResponse = {
    userId: loggedInUserId,
    assessmentId: currentQuestions[currentIndex]?.id,
    selectedOption: selectedValue
  };

  // Update the responses array properly
  const updatedResponses = [...responses];
  updatedResponses[currentIndex] = newResponse;
  
  dispatch(setResponses(updatedResponses));
};

const handleAutoSubmit = () => {
  // Only proceed if no answer was selected
  if (!selectedAnswer) {
    const newResponse = {
      userId: loggedInUserId,
      assessmentId: currentQuestions[currentIndex]?.id,
      selectedOption: "Not Answered"
    };

    const updatedResponses = [...responses];
    updatedResponses[currentIndex] = newResponse;
    dispatch(setResponses(updatedResponses));
  }
  if (currentIndex + 1 < currentQuestions.length) {
    setCurrentIndex(currentIndex + 1);
  } else {
    setIsShowResultsEnabled(true); // ✅ Enables "Show Results" if auto-submitting the last question
  }
  
};
  const handleNextQuestion = () => {
    if (!selectedAnswer) return; // Prevent moving forward without selecting an answer

  const newResponse = {
    userId: loggedInUserId,
    assessmentId: currentQuestions[currentIndex]?.id,
    selectedOption: selectedAnswer || "Not Answered",
  };

  const updatedResponses = [...responses];
  updatedResponses[currentIndex] = newResponse;
  dispatch(setResponses(updatedResponses)); // Save the response
    setSelectedAnswer(null);
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      startTimer();
    } else {
      setIsShowResultsEnabled(true); // ✅ Enables "Show Results" after the last question
    }
    
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentIndex(0);
    setCurrentQuestions([]);
    clearInterval(timerRef.current);
  };

  const cardStyle = {
      width: 600,
      height: 300,
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
    transition: "all 0.3s ease", // Smooth transition
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

  return (
    <div>
      <h2>Assessments</h2>

      {/* {loading && (multipleChoiceQuestions.length > 0 || statementBasedQuestions.length > 0) ? (
        <p>Loading assessments...</p>
      ) : (
        <Row gutter={[10, 0]}>
          <Col>
            <Card
              style={cardStyle}
              title="Multiple-Choice Test"
              hoverable
            >
              <p><strong>Test your knowledge with multiple-choice questions.</strong></p>
              <ul style={listStyle}>
                <li>The test consists of 40 questions.</li>
                <li>Each question has a timer of 10 seconds.</li>
                <li>Each question has 4 options, and only one answer should be chosen.</li>
                <li>At the end of the test, results will be shown.</li>
                <li>You can retake the test if you want.</li>
              </ul>
              <Button
                type="primary"
                onClick={() => handleOpenModal("multiple-choice")}
                style={buttonStyle}
              >
                Take Test
              </Button>
            </Card>
          </Col>
          <Col>
            <Card
              style={cardStyle}
              title="Statement-Based Test"
              hoverable
            >
              <p><strong>Choose statements that best describe you.</strong></p>
              <ul style={listStyle}>
                <li>The test consists of 40 questions.</li>
                <li>Each question has a timer of 10 seconds.</li>
                <li>Each question has 2 statements, and only one answer should be chosen.</li>
                <li>At the end of the test, results will be shown.</li>
                <li>You can retake the test if you want.</li>
              </ul>
              <Button
                type="primary"
                onClick={() => handleOpenModal("statement-based")}
                style={buttonStyle}
              >
                Take Test
              </Button>
            </Card>
          </Col>
        </Row>
      )} */}

      <Modal
        title="Assessment"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        styles={{ body: { minHeight: "300px", padding: 10 } }}
      >
        {currentQuestions.length > 0 && currentIndex < currentQuestions.length && (
          <>
            <p>{currentQuestions[currentIndex].question}</p>
            <p style={timerStyle}>Time Left: {timeLeft}s</p>
            {testType === "mcq" ? (
            <Radio.Group
              onChange={handleAnswerSelect}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {currentQuestions[currentIndex]?.options?.map((option, index) => (
                <Radio key={index} value={option} style={{ marginBottom: "10px" }}>
                  {option}
                </Radio>
              ))}
            </Radio.Group>
          ) : (
            <Row gutter={[16, 16]}>
              {currentQuestions[currentIndex]?.statements?.map((statement, index) => (
                <Col key={index} span={12}>
                  <Card
                    hoverable
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      border: selectedAnswer === statement ? "2px solid #1890ff" : "",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedAnswer(statement)}
                  >
                    {statement}
                  </Card>
                </Col>
              ))}
              </Row>
            )}
            <br />
            <br />

            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              {currentQuestions.map((_, index) => (
                <span
                  key={index}
                  style={{
                    height: "12px",
                    width: "12px",
                    margin: "0 5px",
                    display: "inline-block",
                    borderRadius: "50%",
                    backgroundColor: index === currentIndex ? "blue" : "lightgray",
                  }}
                ></span>
              ))}
            </div>

             <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
        <Button onClick={handleNextQuestion} type="primary" disabled={!selectedAnswer}>
          Next
        </Button>
        <Button 
          onClick={() => {
            console.log('Button clicked', { isShowResultsEnabled, isResultModalOpen });
            if (isShowResultsEnabled && !isResultModalOpen) {
              handleShowResults();
            }
          }}
          type="primary"
          disabled={!isShowResultsEnabled || isResultModalOpen}
        >
          Show Results
        </Button>
      </div>
          </>
        )}
      </Modal>

      <ResultsModal />

      {/* Conditional rendering based on the activeTab state */}
      {activeTab === "quiz" && <QuizList />} {/* Shows QuizList component */}
    </div>
    
  );
};

export default Assessments;