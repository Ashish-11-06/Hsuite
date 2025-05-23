import React, { useEffect, useRef } from "react";
import { Modal, Result, Button } from "antd";

const Confetti = () => {
  const confettiRef = useRef(null);

  useEffect(() => {
    const colors = [
      "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5",
      "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50",
      "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722"
    ];

    const confettiContainer = confettiRef.current;
    const confettiElements = [];

    function createConfettiPiece() {
      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.left = `${Math.random() * window.innerWidth}px`;
      confetti.style.top = `-10px`;
      confetti.style.opacity = `${Math.random() * 0.5 + 0.5}`;
      confetti.style.borderRadius = "2px";
      confetti.style.willChange = "transform, top, left";

      confettiContainer.appendChild(confetti);
      confettiElements.push(confetti);

      let posX = parseFloat(confetti.style.left);
      let posY = -10;
      let angle = Math.random() * 2 * Math.PI;
      let velocity = Math.random() * 4 + 2;
      let rotation = Math.random() * 360;
      let rotationSpeed = Math.random() * 10 - 5;

      const interval = setInterval(() => {
        posX += Math.cos(angle) * velocity;
        posY += Math.sin(angle) * velocity + 1;
        rotation += rotationSpeed;

        confetti.style.left = posX + "px";
        confetti.style.top = posY + "px";
        confetti.style.transform = `rotate(${rotation}deg)`;

        if (posY > window.innerHeight) {
          clearInterval(interval);
          confetti.remove();
        }
      }, 30);
    }

    for (let i = 0; i < 100; i++) {
      createConfettiPiece();
    }

    return () => {
      confettiElements.forEach(el => el.remove());
    };
  }, []);

  return (
    <div
      ref={confettiRef}
      style={{
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "visible",
        zIndex: 9999,
      }}
    />
  );
};

const PersonalityCongratsModal = ({ visible, onClose, onDone }) => {
  return (
    <Modal open={visible} footer={null} onCancel={onClose} closable={false} centered>
      {visible && <Confetti />}
      <Result
        icon={<span style={{ fontSize: "48px" }}>🎉</span>}
        title="Congratulations!"
        subTitle="You've completed all the treatment steps successfully."
        extra={
          <Button type="primary" onClick={onDone}>
            Done
          </Button>
        }
      />
    </Modal>
  );
};

export default PersonalityCongratsModal;