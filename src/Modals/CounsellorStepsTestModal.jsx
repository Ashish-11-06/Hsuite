import React, { useEffect, useState } from "react";
import { Modal, Button, Spin, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapyStepsByUserId, fetchAllPrecautions, updateCurrentTherapyStep } from "../Redux/Slices/CounsellorSlice";
import AddCounFeedbackModal from "./AddCounFeedbackModal";
import PersonalityCongratsModal from "./PersonalityCongratsModal";

const { Title, Paragraph } = Typography;

const CounsellorStepsTestModal = ({ 
  visible, 
  onClose, 
  userId, 
  requestId, 
  initialStepIndex = 0 
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [precautions, setPrecautions] = useState([]);
  const [allPrecautions, setAllPrecautions] = useState([]);
  const [steps, setSteps] = useState([]);
  const [viewMode, setViewMode] = useState("precautions");
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [therapyId, setTherapyId] = useState(null);
  const { updateCurrentStepLoading } = useSelector((state) => state.counsellor);
  const [congratsVisible, setCongratsVisible] = useState(false);
  const [noStepsMessage, setNoStepsMessage] = useState("");

  useEffect(() => {
    if (visible && userId && requestId) {
      setLoading(true);
      setCurrentStepIndex(initialStepIndex);

      // Fetch all precautions
      dispatch(fetchAllPrecautions()).then((res1) => {
        if(res1.payload && Array.isArray(res1.payload)) {
          setAllPrecautions(res1.payload);
        }
      });
      
      // Fetch therapy steps
      dispatch(fetchTherapyStepsByUserId(userId)).then((res) => {
  setLoading(false);

  // ✅ Check if payload exists
  if (res.payload) {
    const stepData = Array.isArray(res.payload)
      ? res.payload.find((item) => item.request_id === requestId)
      : null;

    if (stepData) {
      setTherapyId(stepData.id);
      setPrecautions(stepData.precautions || []);

      const parsedSteps = Object.entries(stepData)
        .filter(([key]) => key.startsWith("step_"))
        .map(([key, value]) => ({
          stepNumber: key.replace("_", " "),
          title: value.title,
          description: value.description,
        }))
        .sort((a, b) =>
          parseInt(a.stepNumber.split(" ")[1]) - parseInt(b.stepNumber.split(" ")[1])
        );

      setSteps(parsedSteps);
      setNoStepsMessage(""); // clear message if data is present
    } else {
      setSteps([]);
      setPrecautions([]);
      setNoStepsMessage(res?.payload?.message || "No therapy steps available for this request.");
    }
  } else {
    setSteps([]);
    setPrecautions([]);
    setNoStepsMessage("Unexpected error or empty response.");
  }
});
      setViewMode("precautions");
    }
  }, [visible, userId, requestId, dispatch, initialStepIndex]);

  const handleNext = () => {
    if (viewMode === "precautions") {
      setViewMode("steps");
    } else {
      if (therapyId) {
        dispatch(updateCurrentTherapyStep({ therapy_id: therapyId, stepIndex: currentStepIndex + 1 }));
      }

      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        // Last step reached - show congratulations modal
        setCongratsVisible(true);
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const getPrecautionDescription = (id) => {
    const precaution = allPrecautions.find((p) => p.id === id);
    return precaution ? precaution.description : `Precaution ID: ${id}`;
  };

  const renderPrecautions = () => (
    <>
      <Title level={4}>Precautions</Title>
      {precautions.length > 0 ? (
        <ul>
          {precautions.map((id, index) => (
            <li key={index}>{getPrecautionDescription(id)}</li>
          ))}
        </ul>
      ) : (
        <p>No precautions available.</p>
      )}
      <Button type="primary" onClick={handleNext}>
        Start Therapy Steps
      </Button>
    </>
  );

  const renderStep = () => {
    const step = steps[currentStepIndex];
    return (
      <>
        <Title level={4}>
          {step?.stepNumber.toUpperCase()}: {step?.title}
        </Title>
        <Paragraph>{step?.description}</Paragraph>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button onClick={handlePrev} disabled={currentStepIndex === 0}>
            Previous
          </Button>

          <Button onClick={() => setFeedbackModalVisible(true)}>
            Feedback
          </Button>

          <Button
            type="primary"
            loading={updateCurrentStepLoading}
            onClick={handleNext}
          >
            {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </>
    );
  };

const handleModalClose = () => {
  if (therapyId && viewMode === "steps") {
    dispatch(updateCurrentTherapyStep({ therapy_id: therapyId, stepIndex: currentStepIndex }))
      .then((res) => {
        const successMsg = res?.payload?.updatedData?.message;
        if (successMsg) {
          message.success(successMsg); // ✅ Show success message
        }
      })
      .finally(() => {
        onClose(); // Close the modal after message
      });
  } else {
    onClose(); // If not in steps view or no therapyId, just close
  }
};



  return (
    <>
      <Modal
        title="Therapy Guidance"
        open={visible}
        onCancel={handleModalClose}
        footer={null}
        width={700}
      >
        {loading ? (
          <Spin tip="Fetching data..." />
        ) : viewMode === "precautions" ? (
          renderPrecautions()
        ) : steps.length > 0 ? (
          renderStep()
        ) : (
          <p>{noStepsMessage || "No therapy steps "}</p>
        )}
      </Modal>

      <AddCounFeedbackModal
        visible={feedbackModalVisible}
        onClose={() => setFeedbackModalVisible(false)}
        step={steps[currentStepIndex]}
        userId={userId}
        therapyId={therapyId}
      />

      <PersonalityCongratsModal
        visible={congratsVisible}
        onClose={() => setCongratsVisible(false)}
        onDone={() => {
          setCongratsVisible(false);
          onClose();
        }}
      />
    </>
  );
};

export default CounsellorStepsTestModal;