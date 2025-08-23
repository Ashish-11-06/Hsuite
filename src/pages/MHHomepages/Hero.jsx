import React from "react";
import { Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

const Hero = () => {
  return (
    <div
      style={{
        position: "relative",
        textAlign: "center",
        padding:"10px",
        height: "450px",
        borderRadius: "20px",
        overflow: "hidden",
        marginBottom: "40px",
      }}
    >
      {/* Background Image */}
      <img
        src="/hero.jpg"
        // src="https://www.techexplorist.com/wp-content/uploads/2024/01/brain-neurons.jpg"
        alt="Mental Health"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "20px",
          objectFit: "cover",
          filter: "brightness(70%)",
        }}
      />

      {/* Overlay Text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Title
        level={1}
        style={{
          color: "#fff",
          fontSize: "3rem",
          maxWidth: "100%",
          fontWeight: "bold",
        }}
      >
        "Your Mental Health Matters – Start Your Journey Today"
      </Title>
      </div>
    </div>
  );
};

export default Hero;
