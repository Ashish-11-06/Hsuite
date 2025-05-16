import React, { useEffect } from "react";
import { Modal, Typography, Button, Spin, Alert, Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Line } from '@ant-design/charts';
import {
  postEgogramResult,
  resetEgogramResult,
  fetchAllEgogramCategories,
} from "../Redux/Slices/egoSlice";

const { Title, Text } = Typography;

const EgoTestResultModal = ({ visible, onClose, userId, ratings }) => {
  const dispatch = useDispatch();
  const { result, loading, error, statementCategories } = useSelector((state) => state.ego);

  useEffect(() => {
    if (!visible) return;

    if (!userId) {
      console.error("User ID is required but not available");
      return;
    }

    if (!ratings || Object.keys(ratings).length === 0) {
      console.error("No ratings provided");
      return;
    }

    const payload = {
      user: userId,
      statement_marks: ratings,
    };

    dispatch(fetchAllEgogramCategories());
    dispatch(postEgogramResult(payload));

    return () => {
      dispatch(resetEgogramResult());
    };
  }, [visible, userId, ratings, dispatch]);

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
  point: {
    size: 5,
    shape: 'diamond',
    style: {
      fill: 'white',
      stroke: '#5B8FF9',
      lineWidth: 2,
    },
  },
  lineStyle: {
    lineWidth: 3,
    stroke: '#1890ff',
  },
  color: '#1890ff',
  xAxis: {
    title: {
      text: 'Categories',
      style: {
        fontSize: 14,
      },
    },
    label: {
      style: {
        fontSize: 12,
      },
      autoRotate: true,
    },
  },
  yAxis: {
    title: {
      text: 'Scores',
      style: {
        fontSize: 14,
      },
    },
    min: 0,
    max: maxScore,
    tickInterval: 2,
    label: {
      formatter: (value) => `${value} pts`,
    },
  },
  tooltip: {
    showCrosshairs: true,
    shared: true,
    formatter: (datum) => {
      return {
        name: datum.category,
        value: `${datum.score} points`,
      };
    },
    domStyles: {
      'g2-tooltip': {
        boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  interactions: [
    { type: 'element-active' },
    { type: 'tooltip' },
  ],
};



  return (
    <Modal
      title="Egogram Test Result"
      open={visible}
      onCancel={handleClose}
      footer={[<Button key="close" onClick={handleClose}>Close</Button>]}
      destroyOnClose
      width={750}
      style={{ top: 20 }}
      styles={{ body: { maxHeight: "60vh", overflowY: "auto" } }}
    >
      {loading ? (
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
                  render: (text) => (
                    <Text strong>{text}</Text>
                  ),
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
        <Text>Waiting for results...</Text>
      )}
    </Modal>
  );
};

export default EgoTestResultModal;