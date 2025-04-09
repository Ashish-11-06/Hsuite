import React, { useState, useCallback } from "react";
import { useDispatch, useSelector} from "react-redux";
import { Modal, Table, Spin,  Typography, Card } from "antd";
import { saveResult } from "../Redux/Slices/assessmentSlice";

const { Title, Text } = Typography;
export const useResults = (loggedInUserId, responses, currentQuestions, testType, multipleChoiceQuestions, statementBasedQuestions, setIsModalOpen) => {
  const [resultData, setResultData] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isResultLoading, setIsResultLoading] = useState(false);
  const dispatch = useDispatch();
  const { message, loading } = useSelector((state) => state.assessments);

  const calculateScores = () => {
    if (!responses || !Array.isArray(responses)) {
      // console.error("Responses array is missing or not valid:", responses);
      return {};
    }
    let logical = 0;
    let analytical = 0;
    let strategic = 0;
    let thinking = 0;
    let skip = 0;

    responses.forEach((response) => {
      if (!response || !response.assessmentId) {
        // console.error("Invalid response object:", response);
        return;
      }
      let question;

      if (testType === "mcq") {
        question = multipleChoiceQuestions.find((q) => q.id === response.assessmentId);
      } else {
        question = statementBasedQuestions.options.find((q) => q.id === response.assessmentId);
      }
      if (!question) {
        // console.error(`Question with ID ${response.assessmentId} not found!`);

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
        // console.error(`Invalid option selected for question ${question.id}: ${response.selectedOption}`);
      }
    });

    const totalQuestions = testType === "mcq" ? multipleChoiceQuestions.length : statementBasedQuestions.options.length;
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

  // const handleShowResults = () => {
  //   console.log('ShowResults called', { isResultModalOpen, isResultLoading });
  //     // if (!responses || responses.length !== currentQuestions.length) {
  //     //   return;
  //     // }
    
  //     // // Prevent multiple calls
  //     // if (isResultModalOpen) {
  //     //   return;
  //     // }
  //     if (isResultModalOpen || isResultLoading) {
  //       return;
  //     }

  const handleShowResults = useCallback(() => {
    if (isResultModalOpen || isResultLoading || !responses) {
      console.log('Prevented duplicate call', { isResultModalOpen, isResultLoading });
      return;
    }
    // ... rest of your function
 

    const scores = calculateScores();
    const result = {
      user_id: loggedInUserId,
      ...scores,
      type: testType ,
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
        // console.error(`Question with ID ${response.assessmentId} not found!`);
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
      type: testType,
    };

    setIsResultLoading(true);
    dispatch(saveResult(payload))
      .unwrap()
      .then((result) => {
        const mergedResult = {
          ...result.data, 
          ...result.statistics, // Includes percentages
           type: testType,
          average_count: result.average_count,
          average_percentage: result.average_percentage,
          created_at: result.data.created_at,
          user_id: loggedInUserId,
        };

        setResultData(mergedResult); // Set the merged result
        setIsResultModalOpen(true); // Open the modal
      })
      .catch((error) => {
        // console.error("Save failed:", error);
      })
      .finally(() => {
        setIsResultLoading(false);
      });
  },  [isResultModalOpen, isResultLoading, responses]);

  // const handleCloseResultModal = () => {
  //   setIsResultModalOpen(false);
  //   if (setIsModalOpen) {
  //     setIsModalOpen(false); // Close Assessment Modal (Fix)
  //   }
  // };

  const handleCloseResultModal = () => {
    setIsResultModalOpen(false);
    setIsResultLoading(false); // Add this line
    if (setIsModalOpen) {
      setIsModalOpen(false);
    }
    // Reset result data if needed
    setResultData(null); 
  };

  const columns = [
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Count", dataIndex: "count", key: "count" },
    { title: "Percentage", dataIndex: "percentage", key: "percentage" },
  ];

  const dataSource = resultData ? [
    { key: "1", category: "Logical", count: resultData.logical, percentage: resultData.logical_percentage },
    { key: "2", category: "Analytical", count: resultData.analytical, percentage: resultData.analytical_percentage },
    { key: "3", category: "Strategic", count: resultData.strategic, percentage: resultData.strategic_percentage },
    { key: "4", category: "Thinking", count: resultData.thinking, percentage: resultData.thinking_percentage },
    { key: "5", category: "Skipped", count: resultData.skip, percentage: resultData.skip_percentage },
  ] : [];

  const ResultsModal = () => (
    <Modal
    title={<Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>Test Results</Title>}
      open={isResultModalOpen}
      onCancel={handleCloseResultModal}
      footer={null}
      centered
      width={600}
      maskClosable={false} // Add this
    keyboard={false} 
      // bodyStyle={{ padding: "20px" }}
    >
      {isResultLoading ? (
       <Spin tip="Loading results..." style={{ display: "flex", justifyContent: "center", padding: "20px" }} />
      ) : resultData ? (
        <Card style={{ borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
          {/* <p style={{ textAlign: "center", fontSize: "16px", marginBottom: "15px" }}>
            <Text strong>User ID:</Text> {resultData.user_id}
          </p> */}
          <p style={{ textAlign: "center", fontSize: "16px", marginBottom: "15px" }}>
            <Text strong>Total Questions:</Text> {resultData.total}
          </p>
          <Table 
            columns={columns} 
            dataSource={dataSource} 
            pagination={false} 
            bordered
            style={{ marginBottom: "15px" }}
          />
          {/* <p style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>
            Average Count: {resultData.average_count}
          </p> */}
          <p style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>
            Average Percentage: {resultData.average_percentage}
          </p>
          <p style={{ textAlign: "center", fontSize: "14px", color: "#555" }}>
            <Text type="secondary">Date: {new Date(resultData.created_at).toLocaleString()}</Text>
          </p>
        </Card>
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