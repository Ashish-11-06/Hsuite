import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveResult, fetchMultipleChoiceQuestions, fetchStatementBasedQuestions, setResponses, clearResponses } from "../Redux/Slices/assessmentSlice";
import { Modal, Button, Radio, Card, Row, Col } from "antd";
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
  const [history, setHistory] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // Timer for 7 seconds
  const timerRef = useRef(null); // Store timer ID
  const [testType, setTestType] = useState("");

  // Use the useResults hook
  const { resultData, isResultModalOpen, setIsResultModalOpen, handleShowResults, ResultsModal } = useResults(
    loggedInUserId,
    responses,
    currentQuestions,
    testType,
    multipleChoiceQuestions,
    statementBasedQuestions,
  );

  useEffect(() => {
    dispatch(fetchMultipleChoiceQuestions());
    dispatch(fetchStatementBasedQuestions());
  }, [dispatch]);

  useEffect(() => {
    console.log("Statement Based Questions:", statementBasedQuestions);
  }, [statementBasedQuestions]);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(5);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          if (currentIndex + 1 < currentQuestions.length) {
            handleNextQuestion();
          } else {
            handleShowResults();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (currentIndex < currentQuestions.length) {
      startTimer();
      if (timerRef.current) clearInterval(timerRef.current);

      setTimeLeft(5);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            handleNextQuestion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [currentIndex, currentQuestions.length]);

  const handleOpenModal = (type) => {
    dispatch(clearResponses());
    setTestType(type);

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
        console.error("statementBasedQuestions is not in the expected format:", statementBasedQuestions);
        return;
      }

      allQuestions = statementBasedQuestions.options.map((question) => ({
        ...question,
        question: "What do you think suits you?",
        statements: [
          question.logical,
          question.analytical,
          question.strategic,
          question.thinking,
        ],
      }));
    }

    console.log("All Questions:", allQuestions);
    setCurrentQuestions(allQuestions);
    setCurrentIndex(0);
    setIsModalOpen(true);
    setSelectedAnswer(null);
    startTimer();
  };

  const handleAnswerSelect = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleNextQuestion = () => {
    let newResponse = {
      userId: loggedInUserId,
      assessmentId: currentQuestions[currentIndex]?.id || null,
      selectedOption: selectedAnswer || "Not Answered",
    };
    dispatch(setResponses([...responses, newResponse]));
    console.log("Added response:", newResponse);
    setSelectedAnswer(null);

    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      startTimer();
    } else {
      // Ensure the last response is added only once
      if (responses.length < currentQuestions.length) {
        let lastResponse = {
          userId: loggedInUserId,
          assessmentId: currentQuestions[currentQuestions.length - 1]?.id || null,
          selectedOption: selectedAnswer || "Not Answered",
        };
        dispatch(setResponses([...responses, lastResponse]));
        console.log("Added last response:", lastResponse);
      }
  
      // Ensure handleShowResults is only called once
      if (!isResultModalOpen) {
        handleShowResults();
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentIndex(0);
    setCurrentQuestions([]);
    clearInterval(timerRef.current);
  };

  // const handleCloseResultModal = () => {
  //   setIsResultModalOpen(false);
  //   handleCloseModal();
  // };

  return (
    <div>
      <h2>Assessments</h2>

      {loading && (multipleChoiceQuestions.length > 0 || statementBasedQuestions.length > 0) ? (
        <p>Loading assessments...</p>
      ) : (
        <Row gutter={[10, 0]}>
          <Col>
            <Card
              style={{
                width: "600px",
                height: "300px",
                backgroundColor: "#f0f8ff",
                color: "#000",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "center",
                cursor: "pointer",
              }}
              title="Multiple-Choice Test"
              hoverable
            >
              <p><strong>Test your knowledge with multiple-choice questions.</strong></p>
              <ul style={{ textAlign: "left", fontSize: "12px", paddingLeft: "15px" }}>
                <li>The test consists of 40 questions.</li>
                <li>Each question has a timer of 10 seconds.</li>
                <li>Each question has 4 options, and only one answer should be chosen.</li>
                <li>At the end of the test, results will be shown.</li>
                <li>You can retake the test if you want.</li>
              </ul>
              <Button
                type="primary"
                onClick={() => handleOpenModal("multiple-choice")}
                style={{ marginTop: "10px" }}
              >
                Take Test
              </Button>
            </Card>
          </Col>
          <Col>
            <Card
              style={{
                width: "600px",
                height: "300px",
                backgroundColor: "#f0f8ff",
                color: "#000",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "center",
                cursor: "pointer",
              }}
              title="Statement-Based Test"
              hoverable
            >
              <p><strong>Choose statements that best describe you.</strong></p>
              <ul style={{ textAlign: "left", fontSize: "12px", paddingLeft: "15px" }}>
                <li>The test consists of 40 questions.</li>
                <li>Each question has a timer of 10 seconds.</li>
                <li>Each question has 2 statements, and only one answer should be chosen.</li>
                <li>At the end of the test, results will be shown.</li>
                <li>You can retake the test if you want.</li>
              </ul>
              <Button
                type="primary"
                onClick={() => handleOpenModal("statement-based")}
                style={{ marginTop: "10px" }}
              >
                Take Test
              </Button>
            </Card>
          </Col>
        </Row>
        
      )}

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
            <p style={{ color: "red" }}>Time Left: {timeLeft}s</p>
            <Radio.Group
              onChange={handleAnswerSelect}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {currentQuestions[currentIndex]?.options?.map((option, index) => (
                <Radio key={index} value={option} style={{ marginBottom: "10px" }}>
                  {option}
                </Radio>
              ))}
              {currentQuestions[currentIndex]?.statements?.map((statement, index) => (
                <Radio key={index} value={statement} style={{ marginBottom: "10px" }}>
                  {statement}
                </Radio>
              ))}
            </Radio.Group>

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
        <Button onClick={handleShowResults} type="primary">
          Show Results
        </Button>
      </div>
          </>
        )}
      </Modal>

      <ResultsModal />
    </div>
  );
};

export default Assessments;