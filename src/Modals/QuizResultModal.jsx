import React, { useEffect } from "react";
import { Modal, Table, Tag, Spin, Card, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { submitQuizResults, resetResultsState } from "../Redux/Slices/quizSlice";

const { Title, Text } = Typography;

const QuizResultModal = ({ visible, onClose, questions, selectedAnswers }) => {
  const dispatch = useDispatch();
  const { quizResults, resultsLoading, resultsError } = useSelector((state) => state.quiz);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (visible && questions?.length > 0) {
      dispatch(resetResultsState());

      if (!user?.id) {
        console.error("User not authenticated");
        return;
      }

      const answers = questions.map((question) => ({
        question_id: question.id,
        selected_category: selectedAnswers[question.id]
          ? `category_${selectedAnswers[question.id].split("_")[1]}`
          : "",
      }));

      dispatch(
        submitQuizResults({
          quiz_id: questions[0].quiz,
          answers,
          user_id: user.id,
        })
      );
    }
  }, [visible, questions, selectedAnswers, dispatch, user]);

  useEffect(() => {
    return () => {
      dispatch(resetResultsState());
    };
  }, [dispatch]);

  const renderResults = () => {
    if (!quizResults) return null;

    const categoryScores = quizResults.category_scores || {};
    const totalAnswered = Object.values(categoryScores).reduce((acc, val) => acc + val, 0);

    const dataSource = Object.entries(categoryScores).map(([key, value], index) => ({
      key: index,
      category: (
        <Tag color="blue" style={{ margin: 0 }}>
          {key}
        </Tag>
      ),
      score: value,
    }));

    dataSource.push({
      key: "skip",
      category: (
        <Tag color="red" style={{ margin: 0 }}>
          Skipped
        </Tag>
      ),
      score: quizResults.skip,
    });

    dataSource.push({
      key: "total",
      category: (
        <Text strong style={{ margin: 0 }}>
          Total Questions
        </Text>
      ),
      score: <Text strong>{questions.length}</Text>,
    });

    return (
      <div>
        <Card style={{ marginBottom: 20 }}>
          <Title level={4} style={{ color: "#1890ff" }}>
            Personality Type: {quizResults.result}
          </Title>

          <div style={{ marginTop: 20 }}>
            <Text strong>Date Taken:</Text>
            <Text style={{ marginLeft: 10 }}>
              {new Date(quizResults.date_taken).toLocaleString()}
            </Text>
          </div>

          <div style={{ marginTop: 20 }}>
            <Text strong>Category Scores:</Text>
            <Table
              dataSource={dataSource}
              columns={[
                {
                  title: "Category",
                  dataIndex: "category",
                  key: "category",
                  width: "60%",
                },
                {
                  title: "Score",
                  dataIndex: "score",
                  key: "score",
                  align: "center",
                  width: "40%",
                },
              ]}
              pagination={false}
              bordered
              size="small"
              style={{ marginTop: 10 }}
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <Text strong>Total Answered</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="center">
                      <Text strong>{totalAnswered}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>
        </Card>
      </div>
    );
  };

  return (
    <Modal
      title="Quiz Results"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      {resultsLoading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
          <p>Calculating your results...</p>
        </div>
      ) : resultsError ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ color: "red" }}>
            Error loading results: {resultsError.message || "Unknown error"}
          </p>
        </div>
      ) : (
        renderResults()
      )}
    </Modal>
  );
};

export default QuizResultModal;
