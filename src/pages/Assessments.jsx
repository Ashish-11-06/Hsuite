import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitResponse,
  saveResult,
  fetchQuestions,
} from "../Redux/Slices/assessmentSlice";
import { getUserResults } from "../Redux/API/assessmentapi";
import { Modal, Button, Radio, Card, Row, Col } from "antd";

const Assessments = () => {
  const dispatch = useDispatch();
  const { questions, loading } = useSelector((state) => state.assessments);
  const loggedInUserId = 1;
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responses, setResponses] = useState([]);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // Timer for 7 seconds
  const timerRef = useRef(null); // Store timer ID

  useEffect(() => {
    dispatch(fetchQuestions());
    fetchUserHistory();
  }, [dispatch]);

  // Fetch user history
  const fetchUserHistory = async () => {
    try {
      const { data } = await getUserResults(loggedInUserId);
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Start the timer
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); // Clear any existing timer before starting a new one
    }

    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          handleNextQuestion(); // Move to the next question when the timer hits zero
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    if (currentIndex < currentQuestions.length) {
      startTimer();
      if (timerRef.current) clearInterval(timerRef.current);

      setTimeLeft(10);
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


  // Open Modal for Assessment
  const handleOpenModal = (type) => {
    const filteredQuestions = questions
      .filter((q) => q.type === type)
      .slice(0, 5); // Limit to 5 questions

    setCurrentQuestions(filteredQuestions);
    setCurrentIndex(0);
    setIsModalOpen(true);
    setSelectedAnswer(null);
    setResultData(null);
    setResponses([]);
    startTimer(); // Start the timer when the modal opens
  };

  // Handle Answer Selection
  const handleAnswerSelect = (e) => {
    setSelectedAnswer(e.target.value);
  };

  // Move to Next Question or Show Results
  const handleNextQuestion = () => {
    // if (!selectedAnswer) return; // Prevent moving forward without an answer

    // const response = {
    //   userId: loggedInUserId, // Replace with dynamic user ID if needed
    //   assessmentId: currentQuestions[currentIndex],
    //   selectedOption: selectedAnswer,
    // };

    let response = {
      userId: loggedInUserId,
      assessmentId: currentQuestions[currentIndex]?.id || null,
      selectedOption: selectedAnswer || "Not Answered", // Store unanswered attempts
    };
  

    setResponses((prevResponses) => [...prevResponses, response]);
    dispatch(submitResponse(response));

    setSelectedAnswer(null);

    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      startTimer(); // Restart the timer for the next question
    } else {
      handleShowResults();
    }
  };

  // Calculate Scores & Show Results
  const handleShowResults = () => {
    clearInterval(timerRef.current); // Stop timer when the test ends

    const scores = calculateScores(responses, currentQuestions);
    const dominantTrait = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    const result = {
      userId: loggedInUserId, // Replace with dynamic user ID if needed
      scores: scores,
      summary: `Your dominant trait is ${dominantTrait}.`,
      date: new Date().toISOString(), // Stores the current date & time
    };

    setResultData(result);
    dispatch(saveResult(result));
    setIsResultModalOpen(true);
    setTimeout(fetchUserHistory, 1000);
    fetchUserHistory();
  };

  // Score Calculation Logic
  const calculateScores = (responses) => {
    let scores = { Logical: 0, Creative: 0, Analytical: 0 };

    responses.forEach((response) => {
      const question = currentQuestions.find((q) => q.id === response.assessmentId);

      if (!question) return;

      // Check if it's a multiple-choice question
    if (question.options) {
        if (response.selectedOption === "Logical analysis") {
          scores.Logical += 20;
        }
        if (response.selectedOption === "Creative thinking") {
          scores.Creative += 20;
        }
        if (response.selectedOption === "Solving complex problems") {
          scores.Analytical += 20;
        }
      }
  
      // Check if it's a statement-based question
      if (question.statements) {
        if (response.selectedOption === "I enjoy solving logical puzzles") {
          scores.Logical += 15;
        }
        if (response.selectedOption === "I love coming up with creative ideas") {
          scores.Creative += 15;
        }
        if (response.selectedOption === "I analyze data deeply before making a decision") {
          scores.Analytical += 15;
        }
      }
    });

    return scores;
  };

  return (
    <div>
      <h2>Assessments</h2>

      {loading ? (
        <p>Loading assessments...</p>
      ) : (
        <Row gutter={[10,0]}>
          <Col >
            <Card
              style={{
                width: "600px",
                height: "300px",
                backgroundColor: "#fff",
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
                backgroundColor: "#fff",
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

      {/* Modal for Questions */}
      <Modal
        title="Assessment"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        styles={{ body: { minHeight: "300px", padding: 10 } }}
      >
        {currentQuestions.length > 0 && currentIndex < currentQuestions.length && (
          <>
            <p>{currentQuestions[currentIndex].question}</p>
            <p style={{color: "red"}}>Time Left: {timeLeft}s</p> {/* Display timer */}

            <Radio.Group
              onChange={handleAnswerSelect}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {(
                currentQuestions[currentIndex].options ||
                currentQuestions[currentIndex].statements
              ).map((option, index) => (
                <Radio key={index} value={option} style={{ marginBottom: "10px" }}>
                  {option}
                </Radio>
              ))}
            </Radio.Group>

            <br />
            <br />

            {/* Progress Indicator */}
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

            {/* Navigation Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            {responses.length > 0 && (
                <Button
                type="default"
                onClick={() => setIsHistoryModalOpen(true)}
                style={{ marginRight: "auto" }} // Aligns to the left
                >
                View full History
                </Button>
            )}

            <Button
                onClick={handleNextQuestion}
                type="primary"
                disabled={!selectedAnswer}
            >
                {currentIndex === currentQuestions.length - 1 ? "Show Results" : "Next"}
            </Button>
            </div>

          </>
        )}
      </Modal>

      {/* Results Modal */}
      <Modal
        title="Results"
        open={isResultModalOpen}
        onCancel={() => setIsResultModalOpen(false)}
        footer={null}
      >
        {resultData ? (
          <>
            {Object.entries(resultData.scores).map(([trait, percentage]) => (
              <p key={trait}>
                {trait}: {percentage}%
              </p>
            ))}
            <p>{resultData.summary}</p>
          </>
        ) : (
          <p>Loading results...</p>
        )}
      </Modal>

       {/* History Modal */}
       <Modal
        title="Assessment History"
        open={isHistoryModalOpen}
        onCancel={() => setIsHistoryModalOpen(false)}
        footer={null}
      >
        {history.length > 0 ? (
          history.map((assessment, index) => (
            <Card key={index} style={{ marginBottom: 10 }}>
              <p><strong>Date:</strong> {new Date(assessment.date).toLocaleString()}</p>
              <p><strong>Primary Trait:</strong> {Object.keys(assessment.scores)[0] || "Unknown"}</p>
              {Object.entries(assessment.scores).map(([trait, percentage]) => (
                <p key={trait}>{trait}: {percentage}%</p>
              ))}
            </Card>
          ))
        ) : (
          <p>No past assessments found.</p>
        )}
      </Modal>
    </div>
  );
};

export default Assessments;
