import React, { useState } from "react";
import { useDispatch} from "react-redux";
import { Modal } from "antd";
import { saveResult } from "../Redux/Slices/assessmentSlice";

export const useResults = (loggedInUserId, responses, currentQuestions, testType, multipleChoiceQuestions, statementBasedQuestions) => {
  const [resultData, setResultData] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isResultLoading, setIsResultLoading] = useState(false);
  const dispatch = useDispatch();

  const calculateScores = () => {
    let logical = 0;
    let analytical = 0;
    let strategic = 0;
    let thinking = 0;
    let skip = 0;

    responses.forEach((response) => {
      let question;

      if (testType === "multiple-choice") {
        question = multipleChoiceQuestions.find((q) => q.id === response.assessmentId);
      } else {
        question = statementBasedQuestions.options.find((q) => q.id === response.assessmentId);
      }
      if (!question) {
        console.error(`Question with ID ${response.assessmentId} not found!`);
        return;
      }

      if (response.selectedOption === "Not Answered") {
        skip++;
      } else if (response.selectedOption === question.logical) {
        logical++;
      } else if (response.selectedOption === question.analytical) {
        analytical++;
      } else if (response.selectedOption === question.strategic) {
        strategic++;
      } else if (response.selectedOption === question.thinking) {
        thinking++;
      } else {
        console.error(`Invalid option selected for question ${question.id}: ${response.selectedOption}`);
      }
    });

    const totalQuestions = testType === "multiple-choice" ? multipleChoiceQuestions.length : statementBasedQuestions.options.length;
    // Calculate percentages
  const logicalPercentage = ((logical / totalQuestions) * 100).toFixed(1) + "%";
  const analyticalPercentage = ((analytical / totalQuestions) * 100).toFixed(1) + "%";
  const strategicPercentage = ((strategic / totalQuestions) * 100).toFixed(1) + "%";
  const thinkingPercentage = ((thinking / totalQuestions) * 100).toFixed(1) + "%";
  const skipPercentage = ((skip / totalQuestions) * 100).toFixed(1) + "%";

  // Calculate average count and percentage
  const averageCount = (logical + analytical + strategic + thinking) / 4;
  const averagePercentage = ((averageCount / totalQuestions) * 100).toFixed(1) + "%";


    return {
      total: totalQuestions,
      logical,
      analytical,
      strategic,
      thinking,
      skip,
      logical_percentage: logicalPercentage,
    analytical_percentage: analyticalPercentage,
    strategic_percentage: strategicPercentage,
    thinking_percentage: thinkingPercentage,
    skip_percentage: skipPercentage,
    average_count: averageCount,
    average_percentage: averagePercentage,
    };
  };

  const handleShowResults = () => {
    console.log("Responses:", responses);
    console.log("Current Questions:", currentQuestions);
    if (responses.length !== currentQuestions.length) {
        console.error("Missing responses! Expected:", currentQuestions.length, "Received:", responses.length);
        return;
      }
    
      // Prevent multiple calls
      if (isResultModalOpen) {
        return;
      }
    const scores = calculateScores();
    const result = {
      user_id: loggedInUserId,
      ...scores,
      created_at: new Date().toISOString(),
    };

    setResultData(result);
    setIsResultModalOpen(true);

    const mappedResponses = responses.map((response) => {
      let question = multipleChoiceQuestions.find((q) => q.id === response.assessmentId);

      if (!question && statementBasedQuestions && statementBasedQuestions.options) {
        question = statementBasedQuestions.options.find((q) => q.id === response.assessmentId);
      }

      if (!question) {
        console.error(`Question with ID ${response.assessmentId} not found!`);
        return "";
      }

      if (response.selectedOption === question.logical) {
        return "logical";
      } else if (response.selectedOption === question.analytical) {
        return "analytical";
      } else if (response.selectedOption === question.strategic) {
        return "strategic";
      } else if (response.selectedOption === question.thinking) {
        return "thinking";
      } else {
        return "";
      }
    });

    const payload = {
      user_id: loggedInUserId,
      responses: mappedResponses,
    };

    setIsResultLoading(true);
    dispatch(saveResult(payload))
      .unwrap()
      .then((result) => {
        const mergedResult = {
          ...result.data, 
          ...result.statistics, // Includes percentages
          average_count: result.average_count,
          average_percentage: result.average_percentage,
          created_at: result.data.created_at,
          user_id: loggedInUserId,
        };

        setResultData(mergedResult); // Set the merged result
        setIsResultModalOpen(true); // Open the modal
      })
      .catch((error) => {
        console.error("Save failed:", error);
      })
      .finally(() => {
        setIsResultLoading(false);
      });
  };

  const handleCloseResultModal = () => {
    setIsResultModalOpen(false);
    // handleCloseModal();
  };

  const ResultsModal = () => (
    <Modal
      title="Results"
      open={isResultModalOpen}
      onCancel={handleCloseResultModal}
      footer={null}
    >
      {isResultLoading ? (
        <p>Loading results...</p>
      ) : resultData ? (
        <div>
          <h3>Test Results</h3>
          <p><strong>User ID:</strong> {resultData.user_id}</p>
        <p><strong>Total Questions:</strong> {resultData.total}</p>
        <p><strong>Logical:</strong> {resultData.logical} ({resultData.logical_percentage})</p>
        <p><strong>Analytical:</strong> {resultData.analytical} ({resultData.analytical_percentage})</p>
        <p><strong>Strategic:</strong> {resultData.strategic} ({resultData.strategic_percentage})</p>
        <p><strong>Thinking:</strong> {resultData.thinking} ({resultData.thinking_percentage})</p>
        <p><strong>Skipped:</strong> {resultData.skip} ({resultData.skip_percentage})</p>
        <p><strong>Average Count:</strong> {resultData.average_count}</p>
        <p><strong>Average Percentage:</strong> {resultData.average_percentage}</p>
        <p><strong>Date:</strong> {new Date(resultData.created_at).toLocaleString()}</p>
      </div>
      ) : (
        <p>No results found.</p>
      )}
    </Modal>
  );

  return {
    resultData,
    isResultModalOpen,
    setIsResultModalOpen,
    handleShowResults,
    ResultsModal,
  };
};