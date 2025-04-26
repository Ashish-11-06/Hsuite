import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { useResults } from '../pages/Results';

const BasedQuestionModal = ({
  modalType,
  visible,
  onClose,
  currentQuestionIndex,
  currentQuestions,
  selectedOptions,
  onOptionSelect,
  onPrevious,
  onNext,
  onSubmit,
  multipleChoiceQuestions,
  statementBasedQuestions,
  loggedInUserId
}) => {
  const [randomOptions, setRandomOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [responses, setResponses] = useState([]);
  const currentQuestion = currentQuestions[currentQuestionIndex] || {};

  // Use the results hook
  const {
    resultData,
    isResultModalOpen,
    handleShowResults,
    ResultsModal
  } = useResults(
    loggedInUserId,
    responses,
    currentQuestions,
    modalType === 'multiple' ? 'mcq' : 'statement',
    multipleChoiceQuestions,
    statementBasedQuestions,
    () => onClose()
  );

  // Timer effect
useEffect(() => {
    if (!visible) return;
    
    // Only reset timer if the question index actually changed
    setTimeLeft(10);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
    // We use JSON.stringify to ensure we only restart when the actual question changes
  }, [visible, JSON.stringify(currentQuestion), onNext]);

  // Prepare responses when selectedOptions change
  useEffect(() => {
    const preparedResponses = Object.entries(selectedOptions).map(([assessmentId, selectedOption]) => {
      const question = currentQuestions.find(q => q.id.toString() === assessmentId);
      let optionText = '';
      
      if (question) {
        if (modalType === 'multiple') {
          // For multiple choice, find which property matches the selected option
          if (selectedOption === 'strategic') optionText = question.strategic;
          else if (selectedOption === 'logical') optionText = question.logical;
          else if (selectedOption === 'analytical') optionText = question.analytical;
          else if (selectedOption === 'thinking') optionText = question.thinking;
        } else {
          // For statement based, the selectedOption is the key (logical, analytical, etc.)
          optionText = question[selectedOption];
        }
      }
      
      return {
        assessmentId: parseInt(assessmentId),
        selectedOption: optionText || 'Not Answered'
      };
    });
    
    setResponses(preparedResponses);
  }, [selectedOptions, currentQuestions, modalType]);

  // Function to get 2 random options from the question
  const getRandomOptions = (question) => {
    if (!question) return [];
    
    if (modalType === 'multiple') {
      return [
        { id: 'strategic', text: question.strategic },
        { id: 'logical', text: question.logical },
        { id: 'analytical', text: question.analytical },
        { id: 'thinking', text: question.thinking }
      ];
    } else {
      // For statement based questions
      const allOptions = [
        { id: 'logical', text: question.logical },
        { id: 'analytical', text: question.analytical },
        { id: 'strategic', text: question.strategic },
        { id: 'thinking', text: question.thinking }
      ];
      
      // Shuffle array and pick first 2
      const shuffled = [...allOptions].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 2);
    }
  };

  useEffect(() => {
    if (currentQuestion && Object.keys(currentQuestion).length > 0) {
      setRandomOptions(getRandomOptions(currentQuestion));
    }
  }, [currentQuestion, modalType]);

  const handleSubmitAndShowResults = () => {
    onSubmit(); // Call the original submit handler
    handleShowResults(); // Show the results
  };

  return (
    <>
      <Modal
        title={modalType === 'multiple' ? 'Multiple Choice Test' : 'Statement Based Test'}
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="back" onClick={onClose}>
            Cancel
          </Button>,
          currentQuestionIndex > 0 && (
            <Button key="prev" onClick={onPrevious}>
              Previous
            </Button>
          ),
          currentQuestionIndex < currentQuestions.length - 1 ? (
            <Button key="next" type="primary" onClick={onNext}>
              Next
            </Button>
          ) : (
            <Button key="submit" type="primary" onClick={handleSubmitAndShowResults}>
              Submit
            </Button>
          ),
        ]}
        width={800}
        styles={{
          body: {
            padding: '24px'
          }
        }}
      >
        {currentQuestions.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                fontWeight: 'bold',
                color: '#666'
              }}>
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </div>
              <div style={{
                fontWeight: 'bold',
                color: '#ff4d4f',
                fontSize: '16px'
              }}>
                Time left: {timeLeft}s
              </div>
            </div>
            
            <h3 style={{
              margin: '0',
              fontSize: '18px',
              fontWeight: '500'
            }}>
              {modalType === 'multiple' 
                ? currentQuestion.question 
                : "Select the statement that best describes you:"}
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {randomOptions.map((option) => (
                <div 
                  key={option.id} 
                  style={{
                    padding: '12px 16px',
                    border: `1px solid ${selectedOptions[currentQuestion.id] === option.id ? '#1890ff' : '#d9d9d9'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    backgroundColor: selectedOptions[currentQuestion.id] === option.id ? '#e6f7ff' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onClick={() => onOptionSelect(currentQuestion.id, option.id)}
                >
                  <input 
                    type="radio" 
                    checked={selectedOptions[currentQuestion.id] === option.id}
                    onChange={() => {}}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                  />
                  <div>
                    <span style={{
                      fontWeight: '500'
                    }}>{option.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No questions available for this test.</p>
        )}
      </Modal>
      <ResultsModal />
    </>
  );
};

export default BasedQuestionModal;