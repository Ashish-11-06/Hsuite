import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card, Typography, Button, Row, Col, Spin, Alert, Divider,
  Tag, Input, Select, Progress, Empty, Modal
} from 'antd';
import { RiseOutlined, FallOutlined, PlusOutlined } from '@ant-design/icons';
import { getTreatmentById, getTreatmentsByUser, getStepByStepsId } from '../Redux/Slices/personaltreatmentSlice';
import GetPersonalityStepsModal from '../Modals/GetPersonalityStepsModal';
import axios from 'axios';

const { Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const Treatment = () => {
  const { treatmentId } = useParams();
  const userId = useSelector(state => state.auth.user?.id);
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
   const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stepsData, setStepsData] = useState(false);

  const { treatment, treatmentLoading, treatmentError, treatments, treatmentsLoading, treatmentsError } =
    useSelector((state) => state.personaltreatment);

  const refreshTreatments = async () => {
    try {
      setRefreshing(true);
      if (userId) {
        await dispatch(getTreatmentsByUser(userId));
        if (treatmentId) {
          await dispatch(getTreatmentById({
            user_id: userId,
            treatmentid: treatmentId
          }));
        }
      }
    } catch (error) {
      console.error("Error refreshing treatments:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshTreatments();
  }, [dispatch, userId]);

  const handleContinue = async (treatId) => {
  try {
    const resultAction = await dispatch(getTreatmentById({
      user_id: userId,
      treatmentid: treatId
    }));

    if (getTreatmentById.fulfilled.match(resultAction)) {
      const treatmentData = resultAction.payload;
      setSelectedTreatment(treatmentData.data);
      setModalVisible(true);

      const stepId = treatmentData.data.steps;
      // console.log(stepId);

      const stepResult = await dispatch(getStepByStepsId(stepId));
      if (getStepByStepsId.fulfilled.match(stepResult)) {
        // console.log(stepResult.payload);
        setStepsData(stepResult.payload);
      } else {
        console.error("Failed to fetch step data");
      }

    }
  } catch (error) {
    console.error("Error fetching treatment:", error);
  }
};


  const filteredTreatments = treatments?.filter(treatment => {
    const matchesSearch = treatment.category_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === 'all' || treatment.type === filterType;
    return matchesSearch && matchesType;
  });

  const ongoingTreatments = Object.values(
    filteredTreatments
      ?.filter(item => item.current_step < 10)
      .reduce((acc, item) => {
        const key = `${item.category_name}-${item.type}`;
        if (!acc[key] || item.current_step > acc[key].current_step) {
          acc[key] = item;
        }
        return acc;
      }, {})
  );

 const completedTreatments = Object.values(
  filteredTreatments
    ?.filter(item => item.current_step >= 10)
    .reduce((acc, item) => {
      const key = `${item.category_name}-${item.type}`;
      if (!acc[key]) {
        acc[key] = item;
      }
      return acc;
    }, {})
);


  if (treatmentLoading || treatmentsLoading || refreshing) return <Spin size="large" />;
  if (treatmentError || treatmentsError) return <Alert message="Error loading treatments" type="error" />;

    const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <h1>Predefined Treatment</h1>
      <Button type="secondary" onClick={showModal}>Help ?</Button>

      <Modal
  // title="Help"
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={null}  // <-- This removes OK and Cancel buttons
  closable={true} // (default is true) shows the close (X) icon
>
  <p>This page shows treatments that are either ongoing or completed from the predefined treatments made by the admin. These treatments appear after a user takes a test and wants to change a personality trait or category. The system or admin selects the steps, and this page displays those treatments as completed or ongoing.</p>
</Modal>

    </div>

    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {treatmentId && treatment && (
        <>
          <Card title={treatment.category_name} style={{ marginBottom: 24 }}>
            <Row gutter={16} align="middle">
              <Col flex="auto">
                <Text>Step {treatment.current_step} of 10</Text>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => handleContinue(treatment.id)}
                  loading={refreshing}
                >
                  Continue
                </Button>
              </Col>
            </Row>
          </Card>
          <Divider />
        </>
      )}

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Search
              placeholder="Search treatments..."
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: '100%' }}
              disabled={refreshing}
            >
              <Option value="all">All Types</Option>
              <Option value="increase">Increase</Option>
              <Option value="decrease">Decrease</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        {/* Ongoing Treatments Section */}
        <Col span={12}>
          <Card title="Ongoing Treatments" bordered>
            {ongoingTreatments.length > 0 ? (
              <Row gutter={[16, 16]}>
                {ongoingTreatments.map((item) => (
                  <Col xs={24} key={item.id}>
                    <Card
                      title={<Text strong>{item.category_name}</Text>}
                      extra={
                        <Tag color={item.type === 'increase' ? 'green' : 'red'}>
                          {item.type === 'increase' ? <RiseOutlined /> : <FallOutlined />} {item.type}
                        </Tag>
                      }
                      actions={[
                        <Button
                          type={item.id === parseInt(treatmentId) ? 'primary' : 'default'}
                          onClick={() => handleContinue(item.id)}
                          loading={refreshing}
                        >
                          {item.id === parseInt(treatmentId) ? 'Current' : 'Continue'}
                        </Button>
                      ]}
                    >
                      <Text>Step {item.current_step} of 10</Text>
                      <Progress percent={Math.round((item.current_step / 10) * 100)} style={{ marginTop: 10 }} />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Card
                style={{ border: '1px dashed #d9d9d9', textAlign: 'center' }}
                bodyStyle={{ padding: 40 }}
              >
                <Empty description="No ongoing treatments" />
              </Card>
            )}
          </Card>
        </Col>

        {/* Completed Treatments Section */}
        <Col span={12}>
          <Card title="Completed Treatments" bordered>
            {completedTreatments.length > 0 ? (
              <Row gutter={[16, 16]}>
                {completedTreatments.map((item) => (
                  <Col xs={24} key={item.id}>
                    <Card
                      title={<Text strong>{item.category_name}</Text>}
                      extra={
                        <Tag color={item.type === 'increase' ? 'green' : 'red'}>
                          {item.type === 'increase' ? <RiseOutlined /> : <FallOutlined />} {item.type}
                        </Tag>
                      }
                    >
                      <Text>Completed</Text>
                      <Progress percent={100} status="success" style={{ marginTop: 10 }} />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Card
                style={{ border: '1px dashed #d9d9d9', textAlign: 'center' }}
                bodyStyle={{ padding: 40 }}
              >
                <Empty description="No completed treatments" />
              </Card>
            )}
          </Card>
        </Col>
      </Row>

      {selectedTreatment && (
        <GetPersonalityStepsModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            refreshTreatments();
          }}
          stepsData={stepsData}
          quizId={selectedTreatment.steps}
          categoryName={selectedTreatment.category_name}
          type={selectedTreatment.type}
          treatmentId={selectedTreatment.id}
          userId={userId}
          currentStep={selectedTreatment.current_step - 1}
          onComplete={() => {
            refreshTreatments();
            setModalVisible(false);
          }}
        />
      )}
    </div>
    </>
  );
};

export default Treatment;
