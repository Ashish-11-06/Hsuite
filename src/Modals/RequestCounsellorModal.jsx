import React, { useState } from "react";
import { Modal, Typography, Spin, Alert, Input, Button, message, Row, Col, Image } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addCounsellorRequest } from "../Redux/Slices/CounsellorSlice";
import { BASE_URL } from '../Redux/API/axiosInstance';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const RequestCounsellorModal = ({ visible, onClose, counsellor, loading, error }) => {
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [requestCompleted, setRequestCompleted] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  const { requestLoading, requestError } = useSelector(state => state.counsellor);

  const handleSubmit = () => {
    if (!description.trim()) {
      message.warning("Please enter a description before submitting.");
      return;
    }

    dispatch(addCounsellorRequest({
      user_id: userId,
      counsellor: counsellor.id,
      description
    })).then((res) => {
      if (!res.error) {
        setRequestCompleted(true); // mark request as done
        setDescription(""); // clear input
      }
    });
  };

  const profile = counsellor?.profile;

  return (
    <Modal
      title="Counsellor Details"
      open={visible}
      onCancel={() => {
        setRequestCompleted(false); // reset state when modal closes
        onClose();
      }}
      footer={null}
    >
      {!loading && !error && counsellor && (
  <>
    {profile ? (
      <Row gutter={[16, 16]} align="top">
        <Col xs={24} sm={8} md={6}>
          <Image
            src={`${BASE_URL}${profile.photo}`}
            alt="Counsellor"
            width="100%"
            style={{ borderRadius: "8px", objectFit: "cover" }}
          />
        </Col>
        <Col xs={24} sm={16} md={18}>
          <Title level={4}>
            {`${profile.first_name} ${profile.last_name}`}
          </Title>
          <Paragraph><strong>Qualification:</strong> {profile.educational_qualifications}</Paragraph>
          <Paragraph><strong>Experience:</strong> {profile.years_of_experience_months} months</Paragraph>
          <Paragraph><strong>Current Position:</strong> {profile.current_post}</Paragraph>
        </Col>
      </Row>
    ) : (
      <Paragraph type="secondary">Profile information not available</Paragraph>
    )}

    {!requestCompleted ? (
      <>
        <Text strong style={{ display: "block", marginTop: "1.5rem" }}>
          Please add a description for your request:
        </Text>

        <TextArea
          rows={4}
          placeholder="Write your reason or message here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginTop: "0.5rem" }}
        />

        <Button
          type="primary"
          loading={requestLoading}
          onClick={handleSubmit}
          style={{ marginTop: "1rem" }}
          block
        >
          Request Counsellor
        </Button>

        {requestError && (
          <Alert
            message="Request Failed"
            description={requestError}
            type="error"
            showIcon
            style={{ marginTop: "1rem" }}
          />
        )}
      </>
    ) : (
      <Alert
        message="Request Sent"
        description="Please wait for the Counsellor to approve your request."
        type="success"
        showIcon
        style={{ marginTop: "2rem" }}
      />
    )}
  </>
)}

    </Modal>
  );
};

export default RequestCounsellorModal;
