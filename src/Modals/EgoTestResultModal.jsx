import React, { useEffect, useState } from "react";
import { Modal, Typography, Button, Spin, Alert, Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Line } from '@ant-design/charts';
import {
  resetEgogramResult,
  fetchAllEgogramCategories,
} from "../Redux/Slices/egoSlice";
import AddEgoPredefinedTreatModal from "./AddEgoPredefinedTreatModal";

const { Title, Text } = Typography;

const EgoTestResultModal = ({ visible, onClose, result}) => {
  const dispatch = useDispatch();
  const { loading, error, statementCategories } = useSelector((state) => state.ego);
  const user = useSelector((state) => state.auth.user); // Adjust this based on your auth setup

  const [predefinedTreatModalVisible, setPredefinedTreatModalVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
  const res=await dispatch(fetchAllEgogramCategories());
  console.log("Statement Categories fetched:", res);
      } catch (err) {
        console.error("Error fetching categories:", err);
        message.error("Failed to fetch categories. Please try again later.");
      }
    }
    fetchCategories();
    return () => {
      dispatch(resetEgogramResult());
    };
  }, [visible]);

  useEffect(() => {
    if (result?.final_result) {
      message.success("Egogram result submitted successfully!");
    }
    if (error) {
      message.error(error);
    }
  }, [result, error]);

  const handleClose = () => {
    onClose();
    dispatch(resetEgogramResult());
  };

  const chartData = result?.statement_marks
    ? Object.entries(result.statement_marks).map(([categoryId, score]) => ({
        category: statementCategories?.[categoryId] || `Category ${categoryId}`,
        score: Number(score),
      }))
    : [];

  const maxScore = chartData.length > 0 
    ? Math.max(...chartData.map(item => item.score)) + 2 
    : 10;

  const chartConfig = {
    data: chartData,
    xField: 'category',
    yField: 'score',
    height: 350,
    smooth: true,
    area: {
      style: {
        fill: 'rgb(230, 247, 255)',
        fillOpacity: 1,
      },
    },
  
  };

  // ✅ Define renderResults function
  const renderResults = () => (
    <div>
      <Text type="secondary">Waiting for the result...</Text>
    </div>
  );

  return (
    <>
      <Modal
        title="Egogram Test Result"
        open={visible}
        onCancel={handleClose}
        footer={[
  <Button
    key="predefined"
    type="primary"
    onClick={() => setPredefinedTreatModalVisible(true)}
    disabled={!result}
  >
    Predefined Treatment
  </Button>
]}

        destroyOnClose
        width={750}
        style={{ top: 20 }}
        styles={{ body: { maxHeight: "60vh", overflowY: "auto" } }}
      >
        {!result ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <Spin size="large" />
            <Text style={{ display: 'block', marginTop: 16 }}>Processing your results...</Text>
          </div>
        ) : error ? (
          <Alert 
            message="Error" 
            description={error} 
            type="error" 
            showIcon
            style={{ margin: '24px 0' }}
          />
        ) : result && result.final_result ? (
          <div>
            <div
              style={{
                backgroundColor: '#e6f7ff',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #91d5ff',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              <Title level={3} style={{ color: '#096dd9', margin: 0 }}>
                🧠 {result.final_result.category}
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                {result.final_result.category_description}
              </Text>
            </div>

            <div style={{ margin: '24px 0' }}>
              <Title level={4} style={{ marginBottom: 16 }}>
                Scores Overview
              </Title>
              <Line {...chartConfig} />
            </div>

            <div>
              <Title level={4} style={{ marginBottom: 16 }}>
                Detailed Scores
              </Title>
              <Table
                dataSource={chartData}
                columns={[
                  {
                    title: 'Category',
                    dataIndex: 'category',
                    key: 'category',
                    render: (text) => <Text strong>{text}</Text>,
                  },
                  {
                    title: 'Score',
                    dataIndex: 'score',
                    key: 'score',
                    render: (score) => `${score} points`,
                    sorter: (a, b) => a.score - b.score,
                  },
                ]}
                pagination={false}
                bordered
                size="middle"
                style={{ marginBottom: 24 }}
              />
            </div>
          </div>
        ) : (
          <>
            {/* {renderResults()}
            <div style={{ textAlign: "right", marginTop: 20 }}>
              <Button 
                type="primary" 
                onClick={() => setPredefinedTreatModalVisible(true)}
                disabled={!quizResults}
              >
                Predefined Treatment
              </Button>
            </div> */}
          </>
        )}
      </Modal>

      <AddEgoPredefinedTreatModal
  visible={predefinedTreatModalVisible}
  onClose={() => setPredefinedTreatModalVisible(false)}
  userId={user?.id}
  statementCategories={statementCategories}
  resultCategories={chartData.map(item => ({
    id: Object.entries(statementCategories).find(([id, name]) => name === item.category)?.[0] || '',
    name: item.category
  }))}
/>
    </>
  );
};

export default EgoTestResultModal;
