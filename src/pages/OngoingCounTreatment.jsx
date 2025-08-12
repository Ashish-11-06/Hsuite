import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Input,
  Progress,
  Empty,
  Button, 
  Modal
} from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTherapyStepsByUserId } from '../Redux/Slices/CounsellorSlice';
import CounsellorStepsTestModal from '../Modals/CounsellorStepsTestModal';

const { Text } = Typography;
const { Search } = Input;

const OngoingCounTreatment = () => {
  const dispatch = useDispatch();
  const { therapyStepsByUserId, therapyStepsLoading, therapyStepsError } = useSelector(
    (state) => state.counsellor
  );
  const userId = useSelector((state) => state.auth.user?.id);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
     const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTherapyStepsByUserId(userId));
    }
  }, [dispatch, userId]);

  const getCurrentStepInfo = (treatment) => {
    const stepData = treatment[`step_${treatment.current_step}`];
    return stepData || {};
  };

  const filtered = therapyStepsByUserId.filter((treatment) => {
    const { title = '', description = '' } = getCurrentStepInfo(treatment);
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const ongoingTreatments = filtered.filter(t => t.current_step < 10);
  const completedTreatments = filtered.filter( t => t.current_step === 10 || t.current_step === 11);

  const handleContinue = (treatment) => {
    setSelectedTreatment(treatment);
    setModalVisible(true);
  };

  const handlePrint = (treatment) => {
    const printContent = document.getElementById('print-section');

    const precautions = treatment.precautions || [];
    let content = `
      <div>
        <h2>${treatment.therapy_title}</h2>
        <h3>Precautions</h3>
        <ul>
          ${precautions.map((p) => `<li>${p.title}</li>`).join('')}
        </ul>
        <h3>Steps</h3>
        <ol>
    `;

    for (let i = 1; i <= 10; i++) {
      const step = treatment[`step_${i}`];
      if (step) {
        content += `<li><strong>${step.title}</strong><br/>${step.description}</li>`;
      }
    }

    content += `</ol></div>`;

    printContent.innerHTML = content;
    printContent.style.display = 'block';

    window.print();

    setTimeout(() => {
      printContent.style.display = 'none';
    }, 1000);
  };

   const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <h1>Counsellor Treatment</h1>
      <Button type="secondary" onClick={showModal}>Help ?</Button>

      <Modal
  // title="Help"
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={null}  // <-- This removes OK and Cancel buttons
  closable={true} // (default is true) shows the close (X) icon
>
  <p>On this page, you can view all your ongoing and completed treatments. Each treatment will be shown based on its status—ongoing or completed. You can also download a PDF of the steps. These treatments appear after you choose a counsellor, send a request, and the counsellor adds steps for you. Once added, the steps will be displayed here so you can proceed with your treatment.</p>
</Modal>

    </div>
      <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Search
                placeholder="Search treatments..."
                allowClear
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </Col>
          </Row>
        </Card>

       <Row gutter={24}>
  <Col span={12}>
    <Card title="Ongoing Treatments" bordered>
      {therapyStepsLoading ? (
        <p>Loading...</p>
      ) : ongoingTreatments.length > 0 ? (
        ongoingTreatments.map((treatment) => {
          const currentStep = getCurrentStepInfo(treatment);
          return (
            <Card key={treatment.id} style={{ marginBottom: 12 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8
              }}>
                <Text strong>{treatment.therapy_title}</Text>
                <PrinterOutlined
                  onClick={() => handlePrint(treatment)}
                  style={{
                    fontSize: 18,
                    color: '#1890ff',
                    cursor: 'pointer'
                  }}
                  title="Download as PDF"
                />
              </div>
              <Text type='secondary' style={{display:'block', marginBottom: 4 }}>
                Step {treatment.current_step} of 10
              </Text>

              <Progress
                percent={(treatment.current_step / 10) * 100}
                strokeColor="#1890ff"
                style={{ marginBottom: 8 }}
              />

              <button
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
                onClick={() => handleContinue(treatment)}
              >
                Continue
              </button>
            </Card>
          );
        })
      ) : (
        <Empty description="No ongoing treatments" />
      )}
    </Card>
  </Col>

  <Col span={12}>
    <Card title="Completed Treatments" bordered>
      {therapyStepsLoading ? (
        <p>Loading...</p>
      ) : completedTreatments.length > 0 ? (
        completedTreatments.map((treatment) => {
          const currentStep = getCurrentStepInfo(treatment);
          return (
            <Card key={treatment.id} style={{ marginBottom: 12 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8
              }}>
                <Text strong>{treatment.therapy_title}</Text>
                <PrinterOutlined
                  onClick={() => handlePrint(treatment)}
                  style={{
                    fontSize: 18,
                    color: '#1890ff',
                    cursor: 'pointer'
                  }}
                  title="Download as PDF"
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <Text type="" style={{ display: 'block' }}>
                  Completed
                </Text>
              </div>

              <Progress
                percent={100}
                strokeColor="#52c41a"
                showInfo={false}
                style={{ marginBottom: 8 }}
              />
            </Card>
          );
        })
      ) : (
        <Empty description="No completed treatments" />
      )}
    </Card>
  </Col>
</Row>


        {therapyStepsError && (
          <p style={{ color: 'red', marginTop: 20 }}>
            {/* Error: {therapyStepsError?.message ?? String(therapyStepsError)} */}

          </p>
        )}
      </div>

      {/* Hidden printable section */}
      <div id="print-section" style={{ display: 'none' }}></div>

      {/* Modal */}
      {selectedTreatment && (
        <CounsellorStepsTestModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            dispatch(fetchTherapyStepsByUserId(userId));}}
          userId={userId}
          requestId={selectedTreatment.request_id}
          initialStepIndex={selectedTreatment.current_step - 1}
        />
      )}

      {/* Print styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-section, #print-section * {
              visibility: visible;
            }
            #print-section {
              position: absolute;
              left: 0;
              top: 0;
              background: white;
              padding: 20px;
              width: 100%;
            }
          }
        `}
      </style>
    </>
  );
};

export default OngoingCounTreatment;
