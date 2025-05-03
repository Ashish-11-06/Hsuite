import React, { useEffect } from 'react';
import { Modal, Spin, Result, Tag, Typography, Table, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { submitMcqQuizResult, clearSubmitResultState } from '../Redux/Slices/mcqSlice';
import { StarFilled, TrophyFilled, CrownFilled, FireFilled, MehFilled } from '@ant-design/icons';
import dayjs from 'dayjs';

const MCQTestResultModal = ({ open, onClose, answers, quizData, userId, questions }) => {
  const dispatch = useDispatch();
  const { submitResultLoading, submitResultSuccess, submitResultError, submitResultData } = useSelector((state) => state.mcq);

  const submissionDate = submitResultData?.submitted_at ? dayjs(submitResultData.submitted_at).format('DD MMM YYYY, HH:mm') : '-';
  const totalQuestions = submitResultData?.total_questions ?? 0;
  const skippedQuestions = submitResultData?.skip_questions ?? 0;
  const score = submitResultData?.score ?? 0;
  const performance = submitResultData?.performance ?? 'No Attempt';
  const attemptedQuestions = totalQuestions - skippedQuestions;

  // Optional: color map for tag
  const performanceColorMap = {
    Unsatisfactory: 'red',
    Average: 'orange',
    Good: 'blue',
    Excellent: 'green',
    Marvelous: 'purple',
    'No Attempt': 'default',
  };

  // Define performance icons based on performance levels
  const performanceIconMap = {
    Unsatisfactory: <MehFilled style={{ fontSize: '40px', color: 'red' }} />,
    Average: <FireFilled style={{ fontSize: '40px', color: 'orange' }} />,
    Good: <StarFilled style={{ fontSize: '40px', color: 'blue' }} />,
    Excellent: <CrownFilled style={{ fontSize: '40px', color: 'green' }} />,
    Marvelous: <TrophyFilled style={{ fontSize: '40px', color: 'purple' }} />,
    'No Attempt': <MehFilled style={{ fontSize: '40px', color: '#bfbfbf' }} />,
  };

  const percentage = submitResultData?.percentage ?? '0%';
  // Prepare data for table
  const tableData = [
    { label: 'Total Questions', value: totalQuestions },
    { label: 'Answered Questions', value: attemptedQuestions },
    { label: 'Skipped Questions', value: skippedQuestions },
    { label: 'Score', value: score },
    { label: 'Percentage', value: percentage },
  ];

  const columns = [
    { title: 'Metric', dataIndex: 'label', key: 'label', width: '50%' },  // Ensure equal width for both sides
    { title: 'Value', dataIndex: 'value', key: 'value', width: '50%' },   // Ensure equal width for both sides
  ];

  useEffect(() => {
    if (open && answers && quizData && userId) {
      const payload = {
        user_id: userId,
        quiz_id: quizData.id,
        response: questions.map((question) => {
          const questionId = question.id;
          const userAnswer = answers[questionId];
          const selectedOptions = Array.isArray(userAnswer)
            ? userAnswer
            : userAnswer
            ? [userAnswer]
            : [];

          const mappedAnswers = selectedOptions.map((selected) => {
            for (const key of ['options_1', 'options_2', 'options_3', 'options_4']) {
              if (question[key] === selected) {
                return key;
              }
            }
            return selected;
          });

          return {
            question_id: questionId,
            user_answer: mappedAnswers,
          };
        }),
      };
      dispatch(submitMcqQuizResult(payload));
    }
  }, [open, answers, quizData, userId, dispatch, questions]);

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
      styles={{ body: { padding: '20px' } }}
      style={{ borderRadius: '10px' }}
    >
      {submitResultLoading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : submitResultSuccess ? (
        <div style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            {/* Display performance icon before the performance tag */}
            <div style={{ marginBottom: '10px' }}>
              {performanceIconMap[performance]}
            </div>
            <Typography.Title level={4}>
              <Tag
                color={performanceColorMap[performance]}
                style={{
                  fontSize: '16px',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  textTransform: 'capitalize',
                  boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                {performance}
              </Tag>
            </Typography.Title>
          </div>
          <div style={{ textAlign: 'right', marginBottom: '16px', fontSize: '14px', color: '#555' }}>
            <Typography.Text>
               {submissionDate}
            </Typography.Text>
          </div>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            rowKey="label"
            bordered
            size="small"
            style={{
              marginBottom: '16px',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
            }}
          />
        </div>
      ) : submitResultError ? (
        <Result
          status="error"
          title={null}
          subTitle={submitResultError}
          style={{ marginTop: '50px' }}
        />
      ) : null}
    </Modal>
  );
};

export default MCQTestResultModal;
