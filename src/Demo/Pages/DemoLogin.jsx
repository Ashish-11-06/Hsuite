import React from "react";
import { Typography } from "antd";
import LoginCard from "./LoginCard";

const { Title, Text } = Typography;

const DemoLogin = () => {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      position: "relative",
      overflow: "hidden",
      flexDirection: "column"
    }}>
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          top: 0,
          left: 0,
          zIndex: 0,
          filter: `
             blur(2px)             
              invert(1)
              hue-rotate(180deg)
              brightness(1.3)
              contrast(0.85)
            `,
        }}
      >
        <source src="/medical-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Header */}
      <div style={{
        width: "100%",
        textAlign: "center",
        marginTop: "40px",
        marginBottom: "20px",
        zIndex: 1
      }}>
        <Title level={2} style={{ color: "#2c3e50", margin: 0 }}>
          HSuite - Hospital Management System
        </Title>
      </div>

      {/* Main Content */}
      <div className="main-content-wrapper" style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        maxWidth: "1200px",
        margin: "auto",
        padding: "24px",
        zIndex: 1
      }}>
        {/* Left Section - Branding and Info */}
        <div className="left-panel" style={{
          flex: 1,
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "#ecf0f1",
          marginRight: "24px"
        }}>
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              display: "inline-block",
              position: "relative",
              fontSize: "27px",
              fontWeight: 700,
              color: "#fff",
              overflow: "hidden",
              padding: "4px 8px",
            }}>
              <span style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(to right, #00d8ff, #0088ff)",
                animation: "sweepFull 1.5s ease-out forwards",
                borderRadius: "6px",
                zIndex: 0
              }} />
              <span style={{ position: "relative", zIndex: 1 }}>
                Streamline Your Healthcare Operations
              </span>
            </div>

            <div style={{ marginTop: "24px", fontWeight: "bold" }}>
              {[
                "Secure access for medical professionals",
                "Real-time patient management",
                "Integrated prescription system",
                "Automated billing and reporting"
              ].map((item, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#00d8ff",
                    marginRight: "12px"
                  }} />
                  <Text style={{ color: "#34495e" }}>{item}</Text>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: "24px",
            borderTop: "1px solid rgba(0,0,0,0.1)"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8V12L15 15"
                  stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <Text style={{ color: "#7f8c8d", fontSize: "14px" }}>
              Need help? Contact our support team
            </Text>
          </div>
        </div>

        {/* Right Section: Login Card */}
        <div className="right-panel">
          <LoginCard />
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.2); opacity: 0.3; }
        }

        @keyframes sweepFull {
          0% {
            left: -100%;
            width: 0%;
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            left: 0%;
            width: 100%;
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .main-content-wrapper {
            flex-direction: column !important;
            padding: 16px !important;
          }

          .left-panel,
          .right-panel {
            margin-right: 0 !important;
            padding: 20px !important;
            width: 100% !important;
          }

          .left-panel {
            text-align: center;
          }
        }
      `}</style>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          textAlign: "center",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          padding: "8px 0",
          fontSize: "14px",
          color: "rgba(0,0,0,0.6)",
          letterSpacing: "0.5px",
          fontWeight: 500,
          backdropFilter: "blur(2px)",
        }}
      >
        Designed by{" "}
        <a
          href="https://prushal.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "rgba(0, 8, 255, 0.6)", textDecoration: "underline" }}
        >
          Prushal Technology
        </a>
      </div>
    </div>
  );
};

export default DemoLogin;
