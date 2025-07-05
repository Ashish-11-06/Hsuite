import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { fetch20TestsFotTest } from '../Redux/Slices/egoSlice';
import { Card, Button, Row, Col, Spin, message,  } from 'antd';
import { PlayCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons"; 
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
    const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
   const res=await dispatch(fetch20TestsFotTest());
  //  console.log("Tests fetched:", res);
      }
      catch (err) {
        console.error("Error fetching tests:", err);
        message.error("Failed to fetch tests. Please try again later.");
      }
    }
    fetchTests();
   
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
    <>
    <div style={{ position: "relative", margin: "-18px" }}>
  <Button
    icon={<ArrowLeftOutlined />}
    type="primary"
    onClick={() => navigate(-1)}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      // fontSize: "40px",
      color: "white",
    }}
  >Back</Button>
</div>
    <div style={{ padding: "25px" }}>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
        
          <h1 style={{ marginBottom: '16px' }}>Egogram Tests</h1>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <Card
              title="Egogram Test Instructions"
              bordered={true}
              style={{
                width: '100%',
                maxWidth: '800px',
                border: '1px solid blue',
                borderRadius: '8px',
                backgroundColor: 'rgb(230, 247, 255)',
                boxShadow: '0 2px 8px rgba(18, 8, 8, 0.05)',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <ul style={{ display: 'inline-block', textAlign: 'left', paddingLeft: '20px', marginBottom: 0 }}>
                  <li>There are a total of <strong>20 statements</strong>.</li>
                  <li>Each statement includes a <strong>slider</strong> to rate from <strong>0 to 10</strong>.</li>
                  <li>Each statement has a <strong>timer of 10 seconds</strong>.</li>
                  <li>At the end of the test, you can <strong>view your results</strong>.</li>
                  <li>You can <strong>retake the test</strong> as many times as you want.</li>
                </ul>
              </div>
            </Card>
          </div>
          
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
                    icon={<PlayCircleOutlined />}
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
    </>
  );
};

export default EgogramTest;