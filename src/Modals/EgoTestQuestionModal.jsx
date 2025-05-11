import React, { useEffect, useState } from "react";
import { Modal, Button, Spin, Alert, Typography, Slider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import EgoTestResultModal from "./EgoTestResultModal";
import { fetchStatementsByTestIdToTest } from "../Redux/Slices/egoSlice";

const { Title, Text } = Typography;

const EgoTestQuestionModal = ({ testId, visible, onClose }) => {
  const dispatch = useDispatch();
  const { statementsByTestToTest, loading, error } = useSelector((state) => state.ego);
  const userId = useSelector((state) => state.auth?.user?.id); // Get userId from Redux store

  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState({});
  const [timer, setTimer] = useState(10);
  const [resultModalVisible, setResultModalVisible] = useState(false);

  const currentStatement = statementsByTestToTest[currentIndex];

  useEffect(() => {
    if (visible && testId) {
      dispatch(fetchStatementsByTestIdToTest(testId));
      setCurrentIndex(0);
      setRatings({});
      setResultModalVisible(false);
    }
  }, [visible, testId, dispatch]);

  useEffect(() => {
    if (!currentStatement) return;

    setTimer(10);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          autoNext();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, currentStatement]);

  const autoNext = () => {
    const currentId = currentStatement?.id;
    const currentValue = ratings[currentId] ?? 5;
    setRatings((prev) => ({ ...prev, [currentId]: currentValue }));

    if (currentIndex < statementsByTestToTest.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setResultModalVisible(true);
    }
  };

  const handleNext = () => autoNext();

  const handleSliderChange = (value) => {
    const currentStatementId = currentStatement?.id;
    setRatings({ ...ratings, [currentStatementId]: value });
  };

  const handleClose = () => onClose();

  const renderDots = () => (
    <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "20px 0" }}>
      {statementsByTestToTest.map((_, index) => (
        <span
          key={index}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: index === currentIndex ? "#1890ff" : "#d9d9d9",
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      <Modal
        title="Egogram Test Questions"
        open={visible}
        onCancel={handleClose}
        footer={null}
        destroyOnClose
      >
        {loading ? (
          <Spin size="large" />
        ) : error ? (
          <Alert message="Error" description={error} type="error" />
        ) : currentStatement ? (
          <div>
            <div style={{ margin: "24px 0" }}>
              <Title level={5}>
                Statement {currentIndex + 1} of {statementsByTestToTest.length}
              </Title>
              <Text>{currentStatement.statement}</Text>
            </div>

            <div>
              <Text type="secondary" style={{ color: "red" }}>
                Timer: {timer} sec
              </Text>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text strong>Rate (0 to 10):</Text>
              <Slider
                min={0}
                max={10}
                step={1}
                value={ratings[currentStatement.id] ?? 5}
                onChange={handleSliderChange}
                marks={{
                  0: <div style={markerStyle("red")} />,
                  10: <div style={markerStyle("green")} />,
                }}
                trackStyle={{
                  background: "linear-gradient(to right, red, green)",
                  height: 10,
                }}
                railStyle={{
                  backgroundColor: "#ddd",
                  height: 10,
                }}
                handleStyle={{
                  borderColor: "#888",
                  height: 24,
                  width: 20,
                  marginTop: 2,
                }}
              />
            </div>

            {renderDots()}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" onClick={handleNext}>
                {currentIndex === statementsByTestToTest.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        ) : (
          <Text>No statements found for this test.</Text>
        )}
      </Modal>

      <EgoTestResultModal
        visible={resultModalVisible}
        onClose={() => {
          setResultModalVisible(false);
          onClose();
        }}
        userId={userId}
        ratings={ratings}
      />
    </>
  );
};

const markerStyle = (color) => ({
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  backgroundColor: color,
  position: "relative",
  top: "-10px",
});

export default EgoTestQuestionModal;