import React, { useEffect } from 'react';
import { Modal, List, Typography, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbackByCounsellorId } from '../Redux/Slices/CounsellorSlice';

const { Text } = Typography;

const GetCounFeedbackModal = ({ visible, onClose, userId, therapyId }) => {
  const dispatch = useDispatch();
  const counsellorId = useSelector((state) => state.auth.user?.id);

  const {
    feedbackByCounsellorId,
    fetchFeedbackLoading,
    fetchFeedbackError,
  } = useSelector((state) => state.counsellor);

  useEffect(() => {
    if (visible && counsellorId) {
      // Fetch ALL feedback for the counsellor only by counsellorId
      dispatch(fetchFeedbackByCounsellorId(counsellorId));
    }
  }, [dispatch, counsellorId, visible]);

  // Filter feedback by userId and therapyId locally (on frontend)
  const filteredFeedbacks =
    feedbackByCounsellorId?.feedbacks?.filter(
      (feedback) =>
        feedback.user === userId && feedback.therapy_steps === therapyId
    ) || [];

  // Extract step and description from feedback.description object
  const extractFeedbackData = (descriptionObj) => {
    const stepKey = Object.keys(descriptionObj)[0];
    const stepNumber = stepKey.split('_')[1];
    return {
      step: `Step ${stepNumber}`,
      description: descriptionObj[stepKey]?.description || 'No comment',
    };
  };

  return (
    <Modal
      title={`Feedback`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {fetchFeedbackLoading ? (
        <Spin />
      ) : fetchFeedbackError ? (
        <Alert type="error" message={fetchFeedbackError} />
      ) : filteredFeedbacks.length > 0 ? (
        <List
  dataSource={filteredFeedbacks}
  renderItem={(item) => {
    const feedbackData = extractFeedbackData(item.description);
    return (
      <List.Item>
        <div style={{ width: '100%' }}>
          {/* Step on a separate line */}
          <Text strong>{feedbackData.step}</Text>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            {/* Description on left */}
            <Text style={{ flex: 1, paddingLeft: 50 }}>{feedbackData.description}</Text>
            {/* Date on right */}
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </div>
        </div>
      </List.Item>
    );
  }}
/>

      ) : (
        <Text>No feedback available for this user and therapy session.</Text>
      )}
    </Modal>
  );
};

export default GetCounFeedbackModal;
