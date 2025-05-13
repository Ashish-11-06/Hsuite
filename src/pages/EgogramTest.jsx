import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetch20TestsFotTest } from '../Redux/Slices/egoSlice';
import { Card, Button, Row, Col, Spin, message } from 'antd';
import EgoTestQuestionModal from '../Modals/EgoTestQuestionModal';

const EgogramTest = () => {
  const dispatch = useDispatch();
  const { 
    loading, 
    error,
    testsFor20,
    count
  } = useSelector((state) => state.ego);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    dispatch(fetch20TestsFotTest());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleTakeTest = (test) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTest(null);
  };

  return (
    <div style={{ padding: "24px" }}>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <h1 style={{ marginBottom: '16px' }}>Egogram Tests</h1>
          
          <Row gutter={[16, 16]}>
            {testsFor20 && testsFor20.length > 0 ? (
              testsFor20.map((test) => (
                <Col key={test.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    title={
                      <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                          {test.test_name}
                        </div>
                      </div>
                    }
                    bordered={true}
                    style={{
                      height: '100%',
                      border: '1px solid #1890ff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <p style={{ minHeight: '60px' }}>{test.test_description || 'No description available'}</p>
                    <Button 
                      style={{
                        backgroundColor: "#ffcc00",
                        color: "#333",
                        border: 'none',
                        width: '100%',
                        fontWeight: 'bold',
                      }}
                      onClick={() => handleTakeTest(test)}
                    >
                      Take Test
                    </Button>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <div
                  style={{
                    backgroundColor: '#f0f2f5',
                    padding: '24px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px dashed #ccc',
                  }}
                >
                  <h3>No tests are available.</h3>
                  <p>Please check back later for new tests.</p>
                </div>
              </Col>
            )}
          </Row>
        </>
      )}

      <EgoTestQuestionModal
        open={isModalOpen}   // Changed from 'visible' to 'open' for Ant Design v5+
        onClose={handleCloseModal}
        testId={selectedTest?.id}
      />
    </div>
  );
};

export default EgogramTest;