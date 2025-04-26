import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMultipleChoiceQuestions, 
  fetchStatementBasedQuestions 
} from '../redux/slices/assessmentSlice';
import { Card, Button, Spin, message } from 'antd';
import BasedQuestionModal from '../Modals/BasedQuestionModal';

const BasedQuestions = () => {
  const dispatch = useDispatch();
  const [activeModal, setActiveModal] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  
  const {
    multipleChoiceQuestions,
    statementBasedQuestions,
    loading
  } = useSelector((state) => state.assessments);

  useEffect(() => {
    dispatch(fetchMultipleChoiceQuestions());
    dispatch(fetchStatementBasedQuestions());
  }, [dispatch]);

  const openModal = (type) => {
    setActiveModal(type);
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: optionId
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < getCurrentQuestions().length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    message.success('Test submitted successfully!');
    closeModal();
  };

  const getCurrentQuestions = () => {
    return activeModal === 'multiple' 
      ? multipleChoiceQuestions 
      : statementBasedQuestions.options || [];
  };

  const currentQuestions = getCurrentQuestions();

  return (
    <div className="based-questions-container">
      <h1>Available Assessments</h1>
      
      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="question-types">
          <Card 
            title="Multiple Choice Questions" 
            className="question-card"
            actions={[
              <Button 
                type="primary" 
                onClick={() => openModal('multiple')}
                disabled={multipleChoiceQuestions.length === 0}
              >
                Take Test
              </Button>
            ]}
          >
            <p>
              This test contains {multipleChoiceQuestions.length} multiple-choice questions. 
              Select the best answer for each question.
            </p>
          </Card>

          <Card 
            title="Statement Based Questions" 
            className="question-card"
            actions={[
              <Button 
                type="primary" 
                onClick={() => openModal('statement')}
                disabled={!statementBasedQuestions.options || statementBasedQuestions.options.length === 0}
              >
                Take Test
              </Button>
            ]}
          >
            <p>
              This test contains {statementBasedQuestions.options?.length || 0} statement-based questions. 
              Rate how much you agree with each statement.
            </p>
          </Card>
        </div>
      )}

        <BasedQuestionModal
        modalType={activeModal}
        visible={!!activeModal}
        onClose={closeModal}
        currentQuestionIndex={currentQuestionIndex}
        currentQuestions={currentQuestions}
        selectedOptions={selectedOptions}
        onOptionSelect={handleOptionSelect}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        multipleChoiceQuestions={multipleChoiceQuestions}
        statementBasedQuestions={statementBasedQuestions}
        loggedInUserId={2}
        />
    </div>
  );
};

export default BasedQuestions;