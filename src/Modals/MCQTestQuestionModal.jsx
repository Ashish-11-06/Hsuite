import React, { useEffect, useState } from 'react';
import { Modal, Spin, Card, Radio, Checkbox, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import MCQTestResultModal from './MCQTestResultModal';
import { getQuestionsInQuiz, clearQuestions } from '../Redux/Slices/mcqSlice';

const MCQTestQuestionModal = ({ open, onClose, quizData }) => {
  const dispatch = useDispatch();
  const { questions, loading } = useSelector((state) => state.mcq);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(10);
  
  const currentQuestion = questions[currentIndex];

  // Add renderDots function
  const renderDots = () => {
    if (!Array.isArray(questions)) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        {questions.map((_, index) => (
          <div
            key={index}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              margin: '0 4px',
              backgroundColor: index === currentIndex ? '#1890ff' : '#ccc',
            }}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (!currentQuestion) return;
  
    setTimer(10); // reset timer for new question
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          if (currentIndex === questions.length - 1) {
            handleSubmit(); // auto-submit on last question
          } else {
            setCurrentIndex((prevIndex) => prevIndex + 1);
          }
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [currentIndex, currentQuestion]);

  useEffect(() => {
    if (open && quizData?.id) {
      dispatch(getQuestionsInQuiz(quizData.id));
      setCurrentIndex(0);
      setAnswers({});
    }
    if (!open) {
      dispatch(clearQuestions());
    }
  }, [open, quizData, dispatch]);

  const handleRadioChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value,
    });
  };

  const handleCheckboxChange = (checkedValues) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: checkedValues,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    setResultModalOpen(true);
  };

  const handleCloseResultModal = () => {
    setResultModalOpen(false);
    onClose(); // Close test modal also
  };

  return (
    <Modal
      title={quizData?.name || "Quiz Test"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {questions.length > 0 ? (
            <Card style={{ marginBottom: '16px' }}>
              <h3>Q{currentIndex + 1}: {currentQuestion?.question}</h3>

              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'red', marginBottom: '12px' }}>
                Time Left: {timer}s
              </div>

              {currentQuestion?.type === "single-choice" ? (
                <Radio.Group
                  onChange={handleRadioChange}
                  value={answers[currentQuestion.id]}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}
                >
                  <Radio value={currentQuestion.options_1}>{currentQuestion.options_1}</Radio>
                  <Radio value={currentQuestion.options_2}>{currentQuestion.options_2}</Radio>
                  <Radio value={currentQuestion.options_3}>{currentQuestion.options_3}</Radio>
                  <Radio value={currentQuestion.options_4}>{currentQuestion.options_4}</Radio>
                </Radio.Group>
              ) : (
                <Checkbox.Group
                  onChange={handleCheckboxChange}
                  value={answers[currentQuestion.id]}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}
                >
                  <Checkbox value={currentQuestion.options_1}>{currentQuestion.options_1}</Checkbox>
                  <Checkbox value={currentQuestion.options_2}>{currentQuestion.options_2}</Checkbox>
                  <Checkbox value={currentQuestion.options_3}>{currentQuestion.options_3}</Checkbox>
                  <Checkbox value={currentQuestion.options_4}>{currentQuestion.options_4}</Checkbox>
                </Checkbox.Group>
              )}

              {/* Render dots before the navigation buttons */}
              {renderDots()}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <Button
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                >
                  Previous
                </Button>

                {currentIndex === questions.length - 1 ? (
                  <Button type="primary" onClick={handleSubmit}>
                    Submit Test
                  </Button>
                ) : (
                  <Button type="primary" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <p>No questions available.</p>
          )}
          <MCQTestResultModal
            open={resultModalOpen}
            onClose={handleCloseResultModal}
            answers={answers}
            quizData={quizData}
            userId={1} // hardcoded user_id for now, ideally pass dynamically
            questions={questions}
          />
        </>
      )}
    </Modal>
  );
};

export default MCQTestQuestionModal;