import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Spin, Alert, Card, Tag, Button, Modal, Typography, Empty } from "antd";
import { fetchEgogramHistory, fetchAllEgogramCategories } from "../Redux/Slices/egoSlice";

const { Title, Text } = Typography;

const TAG_COLORS = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple'
];

const EgogramReport = () => {
  const dispatch = useDispatch();
  const { EgogramHistory, statementCategories, loading, error } = useSelector((state) => state.ego);
  const { user } = useSelector((state) => state.auth);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [colorMap, setColorMap] = useState({});

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchEgogramHistory(user.id));
      dispatch(fetchAllEgogramCategories());
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (statementCategories) {
      const newColorMap = {};
      Object.keys(statementCategories).forEach((categoryId, index) => {
        newColorMap[categoryId] = TAG_COLORS[index % TAG_COLORS.length];
      });
      setColorMap(newColorMap);
    }
  }, [statementCategories]);

  const columns = [
    {
      title: "Sr. No.",
      key: "sr_no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Category Scores",
      dataIndex: "statement_marks",
      key: "statement_marks",
      render: (marks) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {marks && Object.entries(marks).map(([categoryId, score]) => {
            const categoryName = statementCategories?.[categoryId] || `Category ${categoryId}`;
            return (
              <Tag color={colorMap[categoryId] || 'blue'} key={categoryId}>
                {categoryName}: {score}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: "Final Result",
      dataIndex: "final_result",
      key: "final_result",
      render: (result) => (
        <div>
          <strong>{result?.category || 'N/A'}</strong>
          <br />
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => {
            setSelectedRecord(record);
            setIsModalVisible(true);
          }}
        >
          Details
        </Button>
      ),
    },
  ];

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  if (!user?.id) {
    return (
      <Card style={{ margin: 20 }}>
        <Alert
          message="Authentication Required"
          description="Please log in to view your Egogram report"
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  const tableData = Array.isArray(EgogramHistory) ? EgogramHistory : [];

  const getModalTableData = () => {
    if (!selectedRecord || !selectedRecord.statement_marks) return [];
    
    return Object.entries(selectedRecord.statement_marks).map(([categoryId, score]) => {
      const categoryName = statementCategories?.[categoryId] || `Category ${categoryId}`;
      return {
        key: categoryId,
        category: categoryName,
        score: score,
        color: colorMap[categoryId] || 'blue'
      };
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>Egogram Performance Report</Title>
      
      {tableData.length === 0 ? (
        <Card 
          style={{ 
            width: '100%', 
            borderRadius: 8,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
            border: '1px solid #f0f0f0'
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary">No Egogram reports available</Text>
            }
          />
        </Card>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey={(record) => record.id}
            pagination={{ pageSize: 10 }}
            style={{ marginTop: 16 }}
          />

          <Modal
            title="Egogram Test Details"
            visible={isModalVisible}
            onCancel={handleModalClose}
            footer={[
              <Button key="close" onClick={handleModalClose}>
                Close
              </Button>
            ]}
            width={800}
          >
            <div style={{ 
              maxHeight: 'calc(100vh - 240px)', 
              overflowY: 'auto',
              paddingRight: '8px'
            }}>
              {selectedRecord && (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ background: '#f0f0f0', padding: 16, borderRadius: 4 }}>
                      <Text strong style={{ fontSize: 16 }}>
                        {selectedRecord.final_result?.category || 'N/A'}
                      </Text>
                      <br />
                      <Text type="secondary">
                        {selectedRecord.final_result?.category_description || 'No description available'}
                      </Text>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <Text strong>Test Date: </Text>
                      <Text>{new Date(selectedRecord.created_at).toLocaleString()}</Text>
                    </div>
                  </div>

                  <Title level={5} style={{ marginBottom: 16 }}>Category Scores</Title>
                  <Table 
                    dataSource={getModalTableData()}
                    columns={[
                      {
                        title: 'Category',
                        dataIndex: 'category',
                        key: 'category',
                        render: (text, record) => (
                          <Tag color={record.color}>{text}</Tag>
                        )
                      },
                      {
                        title: 'Score',
                        dataIndex: 'score',
                        key: 'score',
                        align: 'right'
                      }
                    ]}
                    pagination={false}
                    bordered
                  />
                </>
              )}
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default EgogramReport;