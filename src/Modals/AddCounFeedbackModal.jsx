import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createFeedback } from "../Redux/Slices/CounsellorSlice";

const { TextArea } = Input;

const AddCounFeedbackModal = ({ visible, onClose, step, userId, therapyId }) => {
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState("");

  const { createFeedbackLoading } = useSelector((state) => state.counsellor);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      message.warning("Please enter feedback.");
      return;
    }

      if (!therapyId) {
      message.error("Therapy ID is missing.");
      return;
    }

    const stepKey = step?.stepNumber?.replace(" ", "_") || `step_${step?.id}`;

    const payload = {
    therapy_steps: therapyId, // Actual therapy step ID
      user: userId,
      description: {
        [stepKey]: {
          description: feedback,
        },
      },
    };

    try {
      const res = await dispatch(createFeedback(payload));
      if (res.meta.requestStatus === "fulfilled") {
        message.success("Feedback submitted successfully.");
        setFeedback("");
        onClose();
      } else {
        message.error("Failed to submit feedback.");
      }
    } catch (err) {
      message.error("An error occurred while submitting feedback.");
    }
  };

  return (
    <Modal
      title={`Add Feedback for ${step?.stepNumber?.toUpperCase() || "Step"}`}
      open={visible}
      onCancel={() => {
        setFeedback("");
        onClose();
      }}
      footer={null}
    >
      <TextArea
        rows={4}
        placeholder="Write your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button
          type="primary"
          loading={createFeedbackLoading}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default AddCounFeedbackModal;
