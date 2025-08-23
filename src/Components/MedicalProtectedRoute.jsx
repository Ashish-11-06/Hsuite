// src/Components/MedicalProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";

const MedicalProtectedRoute = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("medicalUser"));

  useEffect(() => {
    if (!user) {
      setIsVisible(true);
    }
  }, [user]);

  if (!user) {
    // Show popup but DO NOT leave black page
    return (
      <>
        <Modal
          open={isVisible}
          footer={[
            <Button
              key="ok"
              onClick={() => {
                setIsVisible(false);
                navigate("/medicalHealth"); // 👈 go to home page
              }}
            >
              OK
            </Button>,
            <Button
              key="login"
              type="primary"
              onClick={() => {
                setIsVisible(false);
                navigate("/medicalHealth/mhlogin"); // 👈 login page
              }}
            >
              Login
            </Button>,
          ]}
          closable={false}
          centered
        >
          <p>Please log in to access this section.</p>
        </Modal>
      </>
    );
  }

  // ✅ Logged in → show the protected component
  return children;
};

export default MedicalProtectedRoute;
