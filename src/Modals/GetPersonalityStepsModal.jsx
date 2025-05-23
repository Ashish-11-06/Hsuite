import React, { useEffect, useState } from "react";
import {
  Modal,
  Card,
  Typography,
  Button,
  Row,
  Col,
  Spin,
  Alert,
  Result,
  Form,
  Input,
  message,
} from "antd";
import { LeftOutlined, RightOutlined, SmileOutlined, CommentOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllSteps, addFeedback, updateCurrentStep } from "../Redux/Slices/personaltreatmentSlice";
import PersonalityCongratsModal from "./PersonalityCongratsModal";

const { Title, Text } = Typography;

const GetPersonalityStepsModal = ({
  visible, onClose, quizId, categoryName, type, treatmentId, userId, currentStep=0, stepsData }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(currentStep);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [form] = Form.useForm();

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const quiz_id = treatmentId;

  const { allSteps, allStepsLoading, allStepsError, loading: stepUpdateLoading } = useSelector(
    (state) => state.personaltreatment
  );

 useEffect(() => {
  // console.log('hello');
  if (visible && quizId) {
    // console.log('in');
    const fetchSteps = async () => {
      try {
        setCurrentStepIndex(0);
        await dispatch(getAllSteps({ quiz_id }));
      } catch (error) {
        console.error("Error fetching personality steps:", error);
      }
    };

    fetchSteps();
  }
}, [visible, quizId, dispatch]);


   useEffect(() => {
    if (visible) {
      setCurrentStepIndex(currentStep);
    }
  }, [visible, currentStep]);

 const stepData = allSteps?.steps || allSteps || stepsData; 
  const stepArray = stepData 
  ? Object.entries(stepData)
      .filter(([key]) => key.startsWith("step_"))
      .sort(([keyA], [keyB]) => {
        const numA = parseInt(keyA.split("_")[1], 10);
        const numB = parseInt(keyB.split("_")[1], 10);
        return numA - numB;
      })
      .map(([_, step]) => step)
  : [];

  // console.log(stepsData);
  // const stepArray = stepsData ;

  const handleNext = async () => {
    if (currentStepIndex < stepArray.length - 1) {
      const newStepIndex = currentStepIndex + 1;
      
      try {
        // Update the current step in the backend
        await dispatch(updateCurrentStep({
          treatment_id: treatmentId,
          step_id: newStepIndex + 1 // assuming step_id is 1-based index
        })).unwrap();
        
        // Only update the UI if the API call succeeds
        setCurrentStepIndex(newStepIndex);
      } catch (error) {
        // message.error("Failed to update step progress");
      }
    } else if (currentStepIndex === stepArray.length - 1) {
      // For the last step, also update the step before showing congrats
      try {
        await dispatch(updateCurrentStep({
          treatment_id: treatmentId,
          step_id: currentStepIndex + 1 // assuming step_id is 1-based index
        })).unwrap();
        
        setShowCongrats(true);
      } catch (error) {
        // message.error("Failed to update final step progress");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSubmitFeedback = async () => {
  try {
    const values = await form.validateFields();

    const payload = {
      treatment: treatmentId,
      user: user?.id || userId, // Use authenticated user's ID if available, fallback to prop
      description: {
        steps: currentStepIndex + 1,
        note: values.note,
      },
    };

    // Dispatch and wait for the feedback submission to complete
    await dispatch(addFeedback(payload)).unwrap();

    message.success("Feedback submitted successfully!");
    form.resetFields();
    setShowFeedback(false);
  } catch (err) {
    console.error("Feedback submission error:", err);
    message.error(err.message || "Failed to submit feedback. Please try again.");
  }
};

  const getCategoryDisplayName = () =>
    stepData?.category_name || categoryName || "Selected Category";

  return (
    <Modal
      title={
        <span>
          Treatment Steps for <b>{getCategoryDisplayName()}</b> ({type})
        </span>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      {allStepsLoading ? (
        <div style={{ textAlign: "center", padding: "24px" }}>
          <Spin size="large" />
          <p>Loading steps...</p>
        </div>
      ) : allStepsError ? (
        <Alert
          // message="Error loading steps"
          // description={allStepsError.message || "Failed to load steps"}
          type="error"
          showIcon
        />
      ) : stepArray.length === 0 ? (
        <Alert
          message="No steps found"
          description={`No ${type} steps found for the selected category`}
          type="warning"
          showIcon
        />
      ) : (
        <>
          <div
            style={{
              maxHeight: "60vh",
              overflowY: "auto",
              marginBottom: 24,
              padding: 16,
              backgroundColor: "#f9f9f9",
              borderRadius: 8,
            }}
          >
            <Card
              title={`Step ${currentStepIndex + 1}`}
              style={{ marginBottom: 16, borderRadius: 10 }}
            >
              <Title level={5} style={{ color: "#3f3f3f" }}>
                {stepArray[currentStepIndex]?.title}
              </Title>
              <Text style={{ fontSize: "16px" }}>
                {stepArray[currentStepIndex]?.description}
              </Text>
            </Card>

            {showFeedback && (
              <Card
                title="Submit Feedback"
                style={{ marginTop: 16, borderRadius: 10 }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{ step: currentStepIndex + 1 }}
                >
                  <Form.Item
                    name="note"
                    label="Feedback Note"
                    rules={[{ required: true, message: "Feedback note is required" }]}
                  >
                    <Input.TextArea rows={4} placeholder="Enter your feedback here" />
                  </Form.Item>
                  <Row justify="end">
                    <Button
                      style={{ marginRight: 8 }}
                      onClick={() => setShowFeedback(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSubmitFeedback}
                    >
                      Submit
                    </Button>
                  </Row>
                </Form>
              </Card>
            )}
          </div>

          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <Button
                icon={<LeftOutlined />}
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
              >
                Previous
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<RightOutlined />}
                onClick={handleNext}
                loading={stepUpdateLoading}
              >
                {currentStepIndex === stepArray.length - 1 ? "Finish" : "Next"}
              </Button>
            </Col>
          </Row>

          <Row justify="center" style={{ marginTop: 16 }}>
            <Button
              type={showFeedback ? "primary" : "default"}
              icon={<CommentOutlined />}
              onClick={() => setShowFeedback(!showFeedback)}
            >
              {showFeedback ? "Hide Feedback" : "Feedback"}
            </Button>
          </Row>
        </>
      )}

      <PersonalityCongratsModal 
        visible={showCongrats}
        onClose={() => setShowCongrats(false)}
        onDone={() => {
          setShowCongrats(false);
          onClose();
        }}
      />
    </Modal>
  );
};

export default GetPersonalityStepsModal;