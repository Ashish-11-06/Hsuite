import React from "react";
import { Modal, Alert } from "antd"; // Ensure Modal and Alert are imported from Ant Design

const HistoryModal = ({ open, onClose, history }) => {
  return (
    <Modal
      title="Code History"
      open={open} // Open state is passed as prop
      onCancel={onClose} // onClose function to close modal
      footer={null} // No footer buttons for now
      width={600}
    >
      {/* Check if history data is available */}
      {history && history.length > 0 ? (
        history.map((entry, index) => (
          <div key={index}>
            <p><strong>Date:</strong> {entry.date}</p> {/* Adjust field names based on your history data */}
            <p><strong>Description:</strong> {entry.description}</p> {/* Adjust field names based on your history data */}
          </div>
        ))
      ) : (
        <Alert message="No history available" type="info" showIcon />
      )}
    </Modal>
  );
};

export default HistoryModal;
