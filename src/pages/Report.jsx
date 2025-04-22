import React, { useEffect, useState } from "react";
import { Table, Card, Button, Tag, Typography, Spin, Alert, Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getQuizReportHistory } from "../Redux/Slices/quizSlice";

const { Title } = Typography;

const Report = () => {
  const dispatch = useDispatch();
  const { data: quizHistory, loading, error } = useSelector((state) => state.quiz);
  const [filteredQuiz, setFilteredQuiz] = useState(null);
  const { user } = useSelector((state) => state.auth); 

  useEffect(() => {
    dispatch(getQuizReportHistory());
  }, [dispatch]);

  
  useEffect(() => {
    if (user?.id) {
      dispatch(getQuizReportHistory());
    }
  }, [dispatch, user?.id]);

  // Show error if user isn't logged in
  if (!user?.id) {
    return (
      <Card style={{ margin: 20 }}>
        <Alert 
          message="Authentication Required"
          description="Please log in to view your quiz reports"
          type="warning"
          showIcon
        />
      </Card> )}

  // Safely get quiz names with proper null checks
  const quizNames = quizHistory?.quiz_history 
    ? [...new Set(quizHistory.quiz_history.map(item => item.quiz_name))]
    : [];

  // Filter data based on selected quiz with proper null checks
  const filteredData = (quizHistory?.quiz_history || [])
    .filter(q => !filteredQuiz || q.quiz_name === filteredQuiz);

  const columns = [
    {
      title: "S.No.",
      dataIndex: "serial",
      key: "serial",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Quiz Name",
      dataIndex: "quiz_name",
      key: "quiz_name",
    },
    {
      title: "Categories",
      key: "categories",
      render: (record) => (
        <div>
          <div><Tag color="blue">{record.quiz?.category_1 || 'Category 1'}: {record.cat_1_marks}</Tag></div>
          <div><Tag color="green">{record.quiz?.category_2 || 'Category 2'}: {record.cat_2_marks}</Tag></div>
          <div><Tag color="orange">{record.quiz?.category_3 || 'Category 3'}: {record.cat_3_marks}</Tag></div>
          <div><Tag color="purple">{record.quiz?.category_4 || 'Category 4'}: {record.cat_4_marks}</Tag></div>
          <div><Tag color="red">Skipped: {record.skip}</Tag></div>
        </div>
      ),
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
    },
    {
      title: "Date",
      dataIndex: "date_taken",
      key: "date_taken",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <Card style={{ margin: 20 }}>
      <Title level={3}>Quiz Reports</Title>

      <div style={{ marginBottom: 20 }}>
        <Button
          type={!filteredQuiz ? "primary" : "default"}
          onClick={() => setFilteredQuiz(null)}
          style={{ marginRight: 10 }}
        >
          All Quizzes
        </Button>
        {quizNames.map((name) => (
          <Button
            key={name}
            type={filteredQuiz === name ? "primary" : "default"}
            onClick={() => setFilteredQuiz(name)}
            style={{ marginRight: 10 }}
          >
            {name}
          </Button>
        ))}
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
      ) : error ? (
        <Alert 
          message="Error loading quiz reports" 
          description={error.message || "Failed to fetch quiz history"} 
          type="error" 
          showIcon 
        />
      ) : !quizHistory?.quiz_history || quizHistory.quiz_history.length === 0 ? (
        <Empty description="No quiz reports available" />
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      )}
    </Card>
  );
};

export default Report;