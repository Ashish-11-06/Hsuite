import React, { useEffect } from 'react';
import { Modal, Spin, Result, Button, Descriptions } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { submitMcqQuizResult, clearSubmitResultState } from '../Redux/Slices/mcqSlice';
import dayjs from 'dayjs';

const MCQTestResultModal = ({ open, onClose, answers, quizData, userId }) => {
  const dispatch = useDispatch();
  const { submitResultLoading, submitResultSuccess, submitResultError, submitResultData } = useSelector((state) => state.mcq);

  // Safely extract fields from response when submitResultData is available
  const performance = submitResultData?.performance ?? '-';
  const submissionDate = submitResultData?.submitted_at ? dayjs(submitResultData.submitted_at).format('DD MMM YYYY, HH:mm') : '-';
  const totalQuestions = submitResultData?.total_questions ?? 0;
  const skippedQuestions = submitResultData?.skip_questions ?? 0;
  const answeredQuestions = totalQuestions - skippedQuestions;
  const score = submitResultData?.score ?? 0;

  useEffect(() => {
    if (open && answers && quizData && userId) {
      const payload = {
        user_id: userId,
        quiz_id: quizData.id,
        response: Object.entries(answers).map(([questionId, userAnswer]) => {
          const selectedOptions = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
  
          return {
            question_id: Number(questionId),
            user_answer: selectedOptions,
          };
        })
      };
      dispatch(submitMcqQuizResult(payload));
    }
  }, [open, answers, quizData, userId, dispatch]);

  const handleClose = () => {
    dispatch(clearSubmitResultState());
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      {submitResultLoading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : submitResultSuccess ? (
        <Result
          status="success"
          title="Quiz Performance"
          extra={[
            <Descriptions column={1} bordered key="details">
              <Descriptions.Item label="Performance">{performance}</Descriptions.Item>
              <Descriptions.Item label="Submission Date">{submissionDate}</Descriptions.Item>
              <Descriptions.Item label="Total Questions">{totalQuestions}</Descriptions.Item>
              <Descriptions.Item label="Answered Questions">{answeredQuestions}</Descriptions.Item>
              <Descriptions.Item label="Skipped Questions">{skippedQuestions}</Descriptions.Item>
              <Descriptions.Item label="Score">{score}</Descriptions.Item>
            </Descriptions>,
            <Button type="primary" onClick={handleClose} key="close">
              Close
            </Button>
          ]}
        />
      ) : submitResultError ? (
        <Result
          status="error"
          title="Submission Failed"
          subTitle={submitResultError}
          extra={[
            <Button type="primary" onClick={handleClose} key="close">
              Close
            </Button>
          ]}
        />
      ) : null}
    </Modal>
  );
};

export default MCQTestResultModal;
