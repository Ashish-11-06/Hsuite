import React, { useEffect, useState } from "react";
import { Table, Card, Button, Tag, Typography, Spin, Alert, Empty, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getQuizReportHistory } from "../Redux/Slices/quizSlice";

const { Title, Text } = Typography;

const Report = () => {
  const dispatch = useDispatch();
  const { data: quizHistory, loading, error } = useSelector((state) => state.quiz);
  const [filteredQuiz, setFilteredQuiz] = useState(null);
  const { user } = useSelector((state) => state.auth); 
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getQuizReportHistory());
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(getQuizReportHistory());
    }
  }, [dispatch, user?.id]);

  const showDetails = (report) => {
    setSelectedReport(report);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (!user?.id) {
    return (
      <Card style={{ margin: 20 }}>
        <Alert 
          message="Authentication Required"
          description="Please log in to view your quiz reports"
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  const quizNames = quizHistory?.quiz_history 
    ? [...new Set(quizHistory.quiz_history.map(item => item.quiz_name))]
    : [];

  const filteredData = (quizHistory?.quiz_history || [])
    .filter(q => !filteredQuiz || q.quiz_name === filteredQuiz);

  // Function to calculate total questions
  const calculateTotalQuestions = (report) => {
    return report.total_questions || 
           (Object.values(report.category_scores || {}).reduce((a, b) => a + b, 0) + (report.skip || 0));
  };

  // Function to calculate total answered
  const calculateTotalAnswered = (report) => {
    return report.total_answered || 
           Object.values(report.category_scores || {}).reduce((a, b) => a + b, 0);
  };

  // Color mapping for categories (consistent between table and modal)
  const getCategoryColor = (categoryName) => {
    const colorMap = {
      // Add your specific category-color mappings here
      // Example:
      // 'Openness': 'blue',
      // 'Conscientiousness': 'green',
      // Default colors if no specific mapping
    };
    
    const defaultColors = ['blue', 'green', 'orange', 'purple', 'cyan', 'magenta', 'red', 'volcano'];
    return colorMap[categoryName] || defaultColors[Math.abs(hashCode(categoryName)) % defaultColors.length];
  };

  // Simple hash function for consistent color assignment
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const columns = [
    {
      title: "S.No.",
      dataIndex: "serial",
      key: "serial",
      render: (_, __, index) => index + 1,
      sorter: (a, b) => a.serial - b.serial,
    },
    {
      title: "Quiz Name",
      dataIndex: "quiz_name",
      key: "quiz_name",
      sorter: (a, b) => a.quiz_name.localeCompare(b.quiz_name),
      filters: quizNames.map(name => ({ text: name, value: name })),
      onFilter: (value, record) => record.quiz_name === value,
      filterSearch: true,
    },
    {
      title: "Categories",
      key: "categories",
      render: (record) => {
        const categories = record.category_scores || {};
        return (
          <div>
            {Object.entries(categories).map(([categoryName, score]) => (
              <Tag key={categoryName} color={getCategoryColor(categoryName)}>
                {categoryName}: {score}
              </Tag>
            ))}
            {record.skip > 0 && <Tag color="red">Skipped: {record.skip}</Tag>}
          </div>
        );
      },
    },
    {
      title: "Total Questions",
      key: "total_questions",
      render: (record) => calculateTotalQuestions(record),
      sorter: (a, b) => calculateTotalQuestions(a) - calculateTotalQuestions(b),
    },
    {
      title: "Total Answered",
      key: "total_answered",
      render: (record) => calculateTotalAnswered(record),
      sorter: (a, b) => calculateTotalAnswered(a) - calculateTotalAnswered(b),
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      render: (result) => <Text style={{ color: '#1890ff' }}>{result}</Text>,
      sorter: (a, b) => a.result.localeCompare(b.result),
    },
    {
      title: "Date",
      dataIndex: "date_taken",
      key: "date_taken",
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => new Date(a.date_taken) - new Date(b.date_taken),
      defaultSortOrder: 'descend',
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => showDetails(record)}>
          View Details
        </Button>
      ),
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
        <>
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="id"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
          
          <Modal
  title="Quiz Report Details"
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={[
    <Button key="back" onClick={handleCancel}>
      Close
    </Button>
  ]}
  width={800}
>
  {selectedReport && (
    <div>
      <Title level={4} style={{ color: '#1890ff' }}>Personality Type: {selectedReport.result}</Title>
      
      <Text strong>Date Taken: </Text>
      <Text>{new Date(selectedReport.date_taken).toLocaleString()}</Text>
      <br /><br />
      
      <Title level={5}>Quiz Summary</Title>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {selectedReport.category_scores && Object.entries(selectedReport.category_scores).map(([category, score]) => (
            <tr key={category} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '8px' }}>
                <Tag color={getCategoryColor(category)}>
                  <strong>{category}</strong>
                </Tag>
              </td>
              <td style={{ padding: '8px' }}>{score}</td>
            </tr>
          ))}
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '8px' }}>
              <Tag color="red">
                <strong>Skipped</strong>
              </Tag>
            </td>
            <td style={{ padding: '8px' }}>{selectedReport.skip}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '8px' }}>
              <Tag color="yellow">
                <strong>Total Answered</strong>
              </Tag>
            </td>
            <td style={{ padding: '8px' }}>{calculateTotalAnswered(selectedReport)}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px' }}>
              <Tag color="green">
                <strong>Total Questions</strong>
              </Tag>
            </td>
            <td style={{ padding: '8px' }}>{calculateTotalQuestions(selectedReport)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )}
</Modal>
        </>
      )}
    </Card>
  );
};

export default Report;