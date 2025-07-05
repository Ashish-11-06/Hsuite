import React, { useState } from "react";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";
import AddPredefinedTreatModal from "./AddPredefinedTreatModal";

const ActionModal = ({ visible, onClose, quizResult, userId }) => {
  const [predefinedModalVisible, setPredefinedModalVisible] = useState(false);
  const navigate = useNavigate();

  const handlePredefinedClick = () => {
    setPredefinedModalVisible(true);
    // console.log("Predefined button clicked");
  };

  const handleCounsellorClick = () => {
    navigate("/counsellor", { state: { quizResult, userId } });
    onClose();
  };

  return (
    <>
      <Modal
        title="Choose Treatment Type"
        open={visible}
        onCancel={onClose}
        footer={null}
        destroyOnClose
        width={700}
        centered
        style={{ height: 500 }}
        styles={{
          body: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          paddingTop: "20px",
          }
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: "60px" }}>
          {/* Predefined Treatment Block */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid #f0f0f0",
              padding: "10px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              width: "270px",
            }}
          >
            <img
              src="/predefined.jpg"
              alt="Predefined"
              style={{
                width: "250px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            />
            <Button type="primary" onClick={handlePredefinedClick} block>
              Predefined
            </Button>
          </div>

          {/* Counsellor Treatment Block */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid #f0f0f0",
              padding: "10px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              width: "270px",
            }}
          >
            <img
              src="/doctor.jpg"
              alt="Counsellor"
              style={{
                width: "250px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            />
            <Button onClick={handleCounsellorClick} block>
              Counsellor
            </Button>
          </div>
        </div>
      </Modal>

      <AddPredefinedTreatModal
        visible={predefinedModalVisible}
        onClose={() => {
          setPredefinedModalVisible(false);
          // console.log("Closing AddPredefinedTreatModal");
          onClose();
        }}
        quizResult={quizResult}
        userId={userId}
      />
    </>
  );
};

export default ActionModal;
