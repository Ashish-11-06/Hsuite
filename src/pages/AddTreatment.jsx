import React, { useState } from 'react';
import { Button } from 'antd';
import AddPrecautionModal from '../Modals/AddPrecautionModal';
import AddCounStepModal from '../Modals/AddCounStepModal';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const AddTreatment = () => {
  const [precautionModalVisible, setPrecautionModalVisible] = useState(false);
  const [CounStepModalVisible, setCounStepModalVisible] = useState(false);
    const location = useLocation();
  const navigate = useNavigate();

  const { requestId, userId } = location.state || {};

  if (!requestId || !userId) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error"
          description="Missing required data. Please go back and try again."
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <Button type="primary" onClick={() => setPrecautionModalVisible(true)}>
        Add Precaution
      </Button>

      <Button type="default" onClick={() => setCounStepModalVisible(true)}>
        Add Steps
      </Button>

      <AddPrecautionModal
        visible={precautionModalVisible}
        onClose={() => setPrecautionModalVisible(false)}
      />

      <AddCounStepModal 
        visible={CounStepModalVisible}
        onClose={()=> setCounStepModalVisible(false)}
        request={requestId}
        userId={userId}
        />

    </>
  );
};

export default AddTreatment;
