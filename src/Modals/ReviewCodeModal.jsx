import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import EditReviewModal from "./EditReviewModal";

const ReviewCodeModal = ({ open, onClose, onReview, code, currentUser }) => {
  const [isEditReviewModalOpen, setIsEditReviewModalOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState(code); // Initialize with the `code` prop

  // Update `currentCode` when the `code` prop changes
  useEffect(() => {
    setCurrentCode(code);
  }, [code]);

  const handleEditReviewClose = (updatedData) => {
    setIsEditReviewModalOpen(false); // Close the EditReviewModal
    if (updatedData) {
      setCurrentCode(updatedData); // Update the local state with the new data
      onClose(updatedData); // Notify the parent component (optional)
    }
  };
  const handleReview = async (status) => {
    try {
      await onReview({
        description_id: currentCode.id,  // Changed from 'id' to 'description_id'
        user_id: 45,       // Changed from 'userId' to 'user_id'
        approved: status === "approved", // Convert to boolean
        updated: true
      });
      onClose();
    } catch (error) {
      console.error("Review failed:", error);
    }
  };
  
  return (
    <>
      <Modal title="Review Code" open={open} onCancel={onClose} footer={null}>
        <p>
          <strong>Book:</strong> {currentCode?.book?.name || "Unknown Book"}
        </p>
        <p>
          <strong>Code:</strong> {currentCode?.code}
        </p>
        <p>
          <strong>Description:</strong> {currentCode?.description}
        </p>

        {currentCode?.sub_descriptions?.length > 0 && (
          <>
            <strong>Sub Descriptions:</strong>
            <ul>
              {currentCode.sub_descriptions.map((sub, index) => (
                <li key={index}>
                  <strong>{sub.code}</strong>: {sub.sub_description}
                </li>
              ))}
            </ul>
          </>
        )}

        <p style={ {textAlign: "center", color: "blue", paddingTop: 20}}>Is everything correct?</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button type="primary"  onClick={() => handleReview("approved")}>
            <CheckOutlined /> Yes
          </Button>
          <Button danger onClick={() => setIsEditReviewModalOpen(true)}>
            <CloseOutlined /> No
          </Button>
        </div>
      </Modal>

      <EditReviewModal
        open={isEditReviewModalOpen}
        onClose={handleEditReviewClose} // Pass the handler
        code={currentCode} // Pass the current code
      />
    </>
  );
};

export default ReviewCodeModal;