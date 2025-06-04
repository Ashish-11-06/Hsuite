import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizReportHistory } from '../Redux/Slices/quizSlice';
import { fetchEgogramHistory, fetchAllEgogramCategories } from '../Redux/Slices/egoSlice';
import { Spin, Typography, Card, Row, Col, Table, Button, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ViewResults = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personality'); // 'personality' or 'egogram'

  const { data: quizReportHistory, loading: quizReportLoading } = useSelector(state => state.quiz);
  const { EgogramHistory, statementCategories, loading: egogramLoading } = useSelector(state => state.ego);

  const colors = ['magenta',  'orange', 'cyan', 'lime', 'green', 'blue','red', 'geekblue','volcano', 'purple', 'pink', 'gold', 'gray'];

const colorMap = {}; // key: category name, value: color string

const getColor = (key) => {
  if (!colorMap[key]) {
    // assign next color based on how many keys assigned so far
    const colorIndex = Object.keys(colorMap).length % colors.length;
    colorMap[key] = colors[colorIndex];
  }
  return colorMap[key];
};


  useEffect(() => {
    if (userId) {
      dispatch(getQuizReportHistory(userId));
      dispatch(fetchEgogramHistory(userId));
      dispatch(fetchAllEgogramCategories());
    }
  }, [dispatch, userId]);

  const dataSource = quizReportHistory?.quiz_history || [];

  const columns = [
    {
    title: 'Sr. No.',
    key: 'index',
    render: (_, __, index) => index + 1,
  },
    {
      title: 'Quiz Name',
      dataIndex: 'quiz_name',
      key: 'quiz_name',
      sorter: (a, b) => a.quiz_name.localeCompare(b.quiz_name),
    },
     {
      title: 'Category Scores',
      dataIndex: 'category_scores',
      key: 'category_scores',
     render: (category_scores) => (
  <ul style={{ paddingLeft: '1rem', margin: 0 }}>
    {category_scores &&
      Object.entries(category_scores).map(([key, value]) => (
        <li key={key}>
          <Tag color={getColor(key)} >
            {key}
          </Tag>
          : {value}
        </li>
      ))}
  </ul>
),
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: 'Skipped Questions',
      dataIndex: 'skip',
      key: 'skip',
      sorter: (a, b) => a.skip - b.skip,
    },
   
    {
      title: 'Date Taken',
      dataIndex: 'date_taken',
      key: 'date_taken',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.date_taken) - new Date(b.date_taken),
      defaultSortOrder: 'descend',
    },
  ];

  const egogramColumns = [
    {
    title: 'Sr. No.',
    key: 'index',
    render: (_, __, index) => index + 1,
  },
    {
      title: 'Statement Marks',
      key: 'statement_marks',
      render: (_, record) => (
  <ul style={{ margin: 0, paddingLeft: '1rem' }}>
    {Object.entries(record.statement_marks).map(([key, value]) => {
      const categoryName = statementCategories?.[key] || `Category ${key}`;
      return (
        <li key={key}>
          <Tag color={getColor(categoryName)}>
            {categoryName}
          </Tag>
          : {value}
        </li>
      );
    })}
  </ul>
),
    },
    {
      title: 'Final Result',
      key: 'final_result',
      render: (_, record) => (
        <div>
          <div><strong>{record.final_result.category}</strong></div>
          <div style={{ fontStyle: 'italic', fontSize: '0.85em' }}>
            {record.final_result.category_description}
          </div>
        </div>
      ),
    },
    {
      title: 'Date Taken',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      defaultSortOrder: 'descend',
    },
  ];

  const renderQuizResults = () => (
    <Card title="Personality Results" style={{ marginBottom: '2rem' }}>
      {dataSource.length > 0 ? (
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      ) : (
        <Text>No quiz report found.</Text>
      )}
    </Card>
  );

  const renderEgogramResults = () => (
    <Card title="Egogram Results">
      {EgogramHistory && EgogramHistory.length > 0 ? (
        <Table
          dataSource={EgogramHistory || []}
          columns={egogramColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      ) : (
        <Text>No egogram report found.</Text>
      )}
    </Card>
  );

  return (
    <>
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: '1rem' }}
      >
        Back
      </Button>

      <div style={{ padding: '2rem' }}>
        <Title level={3}>User Results Overview</Title>

        <div style={{ marginBottom: '1rem' }}>
          <Button
            type={activeTab === 'personality' ? 'primary' : 'default'}
            onClick={() => setActiveTab('personality')}
            style={{ marginRight: '1rem' }}
          >
            Personality Test
          </Button>
          <Button
            type={activeTab === 'egogram' ? 'primary' : 'default'}
            onClick={() => setActiveTab('egogram')}
          >
            Egogram Test
          </Button>
        </div>

        {(quizReportLoading || egogramLoading) ? (
          <Spin size="large" />
        ) : (
          <Row gutter={[16, 16]}>
            <Col span={24}>
              {activeTab === 'personality' ? renderQuizResults() : renderEgogramResults()}
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default ViewResults;
