import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Tag, Card, Typography, Empty, Button, Modal, Descriptions } from 'antd';
import { StarFilled, TrophyFilled, CrownFilled, FireFilled, MehFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMcqResultsByUser, getAllQuizzes } from '../Redux/Slices/mcqSlice';

const { Title, Text } = Typography;

const MCQReport = () => {
  const dispatch = useDispatch();
  const { results, loading, error, quizzes } = useSelector((state) => state.mcq);
  const { user } = useSelector((state) => state.auth);
  const [filteredQuiz, setFilteredQuiz] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMcqResultsByUser(user.id));
      dispatch(getAllQuizzes());
    }
  }, [dispatch, user?.id]);

  const showDetails = (record) => {
    setSelectedResult(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getQuizName = (quizId) => {
    const quiz = quizzes?.find((q) => q.id === quizId);
    return quiz ? quiz.name : `Quiz ${quizId}`;
  };

  const getPerformanceTag = (performance) => {
    switch (performance) {
      case 'Marvelous':
        return <Tag color="purple" icon={<TrophyFilled />}>Marvelous</Tag>;
      case 'Excellent':
        return <Tag color="green" icon={<CrownFilled />}>Excellent</Tag>;
      case 'Good':
        return <Tag color="blue" icon={<StarFilled />}>Good</Tag>;
      case 'Average':
        return <Tag color="orange" icon={<FireFilled />}>Average</Tag>;
      case 'Unsatisfactory':
        return <Tag color="red" icon={<MehFilled />}>Unsatisfactory</Tag>;
      case 'No Attempt':
        return <Tag color="default" icon={<MehFilled />}>No Attempt</Tag>;
      default:
        return <Tag>N/A</Tag>;
    }
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

  const quizNames = quizzes?.map((quiz) => quiz.name) || [];
  const filteredData = results?.filter(
    (result) => !filteredQuiz || getQuizName(result.quiz) === filteredQuiz
  );

  const columns = [
    {
      title: 'Sr. No.',
      key: 'sr',
      render: (_, __, index) => index + 1,
      width: 80,
      align: 'center',
    },
    {
      title: 'Quiz Name',
      key: 'quiz',
      render: (_, record) => getQuizName(record.quiz),
      sorter: (a, b) => getQuizName(a.quiz).localeCompare(getQuizName(b.quiz)),
    },
    {
      title: 'Total Questions',
      dataIndex: 'total_questions',
      key: 'total_questions',
      width: 120,
      align: 'center',
    },
    {
      title: 'Answered',
      key: 'answered',
      render: (_, record) => record.total_questions - record.skip_questions,
      width: 100,
      align: 'center',
    },
    {
      title: 'Skipped',
      dataIndex: 'skip_questions',
      key: 'skipped',
      width: 100,
      align: 'center',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      align: 'center',
    },
    {
      title: 'Percentage %',
      key: 'percentage',
      render: (_, record) => record.percentage ? `${record.percentage.toFixed(1)}%` : 'N/A',
      width: 120,
      align: 'center',
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record) => getPerformanceTag(record.performance),
      width: 150,
      align: 'center',
    },
    {
      title: 'Submitted At',
      dataIndex: 'submitted_at',
      key: 'submitted_at',
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => new Date(a.submitted_at) - new Date(b.submitted_at),
      width: 200,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" onClick={() => showDetails(record)}>
          Details
        </Button>
      ),
      width: 100,
      align: 'center',
    },
  ];

  const summaryTableColumns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '50%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '50%',
    },
  ];

  const summaryTableData = selectedResult ? [
    { key: '1', category: 'Total Questions', value: selectedResult.total_questions },
    { key: '2', category: 'Answered Questions', value: selectedResult.total_questions - selectedResult.skip_questions },
    { key: '3', category: 'Skipped Questions', value: selectedResult.skip_questions },
    { key: '4', category: 'Score', value: selectedResult.score },
    { 
      key: '5', 
      category: 'Percentage', 
      value: selectedResult.percentage ? `${selectedResult.percentage.toFixed(1)}%` : 'N/A'
    },
  ] : [];

  return (
    <Card style={{ margin: 20 }}>
      <Title level={3}>MCQ Performance Report</Title>

      <div style={{ marginBottom: 20 }}>
        <Button
          type={!filteredQuiz ? 'primary' : 'default'}
          onClick={() => setFilteredQuiz(null)}
          style={{ marginRight: 10 }}
        >
          All Quizzes
        </Button>
        {quizNames.map((name) => (
          <Button
            key={name}
            type={filteredQuiz === name ? 'primary' : 'default'}
            onClick={() => setFilteredQuiz(name)}
            style={{ marginRight: 10 }}
          >
            {name}
          </Button>
        ))}
      </div>

      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
      ) : error ? (
        <Alert
          message="Error loading quiz reports"
          description={error.message || 'Failed to fetch quiz history'}
          type="error"
          showIcon
        />
      ) : !results?.length ? (
        <Empty description="No MCQ reports available" />
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      )}

      <Modal
        title="Quiz Report Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedResult && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ fontSize: 16 }}>{getQuizName(selectedResult.quiz)}</Text>
              <br />
              <div style={{ marginTop: 20 }}>
              <Text strong>Performance: </Text>
              {getPerformanceTag(selectedResult.performance)}
            </div>
              <Text type="secondary">
                Submitted on: {new Date(selectedResult.submitted_at).toLocaleString()}
              </Text>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Table
                columns={summaryTableColumns}
                dataSource={summaryTableData}
                pagination={false}
                showHeader={false}
                bordered
              />
            </div>

            

            {/* You can add more detailed information here if needed */}
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default MCQReport;