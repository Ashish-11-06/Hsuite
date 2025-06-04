import { Modal, Select, Form, Input, Button, message, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { fetchAllPrecautions, createTherapy } from '../Redux/Slices/CounsellorSlice';
import { useDispatch, useSelector } from 'react-redux';
import AddPrecautionModal from './AddPrecautionModal';

const AddCounStepModal = ({ visible, onClose, requestId, userId }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { precautions, fetchPrecautionsLoading, fetchPrecautionsError } = useSelector((state) => state.counsellor);
  const { user } = useSelector((state) => state.auth);
  const [submitting, setSubmitting] = useState(false);
const [visibleSteps, setVisibleSteps] = useState(1); 
const [precautionModalVisible, setPrecautionModalVisible] = useState(false);

const handleAddStep = () => {
  if (visibleSteps < 10) {
    setVisibleSteps(prev => prev + 1);
  }
};

  useEffect(() => {
    if (visible) {
      dispatch(fetchAllPrecautions());
      form.resetFields();
    }
  }, [visible, dispatch, form]);

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        setSubmitting(true);
        
        const therapyData = {
          counsellor: user.id,
          user: userId,
          request: requestId,
          request_id: requestId,
          therapy_title: values.title,
          precautions: values.precautions || [], // Now properly getting from form values
          ...values
        };

        console.log('Submitting therapy data:', therapyData); // Debug log

        dispatch(createTherapy(therapyData))
          .unwrap()
          .then(() => {
            message.success('Therapy created successfully!');
            onClose();
          })
          .catch(err => {
            message.error(`Failed to create therapy: ${err.message || err}`);
          })
          .finally(() => {
            setSubmitting(false);
          });
      });
  };

  return (
    <>
    <Modal
      title="Add Therapy Steps"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={submitting} 
          onClick={handleSubmit}
        >
          Create Therapy
        </Button>,
      ]}
      width={800}
    >
<Form form={form} layout="vertical">
  <Form.Item name="title"
  label="Therapy Title"
  rules={[{ required: true, message: 'Please enter therapy title' }]}
  >
  <Input placeholder='Enter Therapy title' />
  </Form.Item>

  <Form.Item
  name="precautions"
label={
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontWeight: '500' }}>Precautions</span>
    <Button type="primary"
    style={{marginLeft: 550}}
     onClick={() => setPrecautionModalVisible(true)}>
      Add Precaution
    </Button>
  </div>
}
>
  {fetchPrecautionsLoading ? (
    <p>Loading precautions...</p>
  ) : fetchPrecautionsError ? (
    <p>Error: {fetchPrecautionsError}</p>
  ) : (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="Select precautions"
      options={precautions.map((precaution) => ({
        label: precaution.description,
        value: precaution.id,
      }))}
    />
  )}
</Form.Item>


  {[...Array(10)].slice(0, visibleSteps).map((_, index) => {
    const stepKey = `step_${index + 1}`;
    return (
      <div key={stepKey} style={{ marginBottom: '1rem', border: '1px dashed #d9d9d9', padding: '12px', borderRadius: '6px' }}>
        <h4>{`Step ${index + 1}`}</h4>
        <Form.Item
          name={[stepKey, 'title']}
          label="Title"
          rules={[{ required: index === 0, message: 'Title is required for Step 1' }]}
        >
          <Input placeholder={`Title for Step ${index + 1}`} />
        </Form.Item>
        <Form.Item
          name={[stepKey, 'description']}
          label="Description"
          rules={[{ required: index === 0, message: 'Description is required for Step 1' }]}
        >
          <Input.TextArea rows={2} placeholder={`Description for Step ${index + 1}`} />
        </Form.Item>
      </div>
    );
  })}

  {visibleSteps < 10 && (
    <Button
      type="dashed"
      onClick={handleAddStep}
      icon={<PlusOutlined />}
      style={{ width: '100%' }}
    >
      Add Step {visibleSteps + 1}
    </Button>
  )}
</Form>
      
    </Modal>
    
    <AddPrecautionModal 
      visible={precautionModalVisible}
      onClose={() => {
      setPrecautionModalVisible(false);
      dispatch(fetchAllPrecautions()); // Refresh precaution list
    }}
    />
    </>
  );
};

export default AddCounStepModal;