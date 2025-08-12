import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createPrecautions } from '../Redux/Slices/CounsellorSlice';

const AddPrecautionModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const [description, setDescription] = useState('');
  const { createPrecautionsLoading } = useSelector(state => state.counsellor);

  const handleSubmit = () => {
    if (description.trim()) {
      dispatch(createPrecautions({ description })).then(() => {
        setDescription('');
        onClose();
      });
    }
  };

  return (
    <Modal
      title="Add Precaution"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Input.TextArea
        rows={4}
        placeholder="Enter precaution description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        type="primary"
        loading={createPrecautionsLoading}
        onClick={handleSubmit}
        className="mt-4"
      >
        Submit
      </Button>
    </Modal>
  );
};

export default AddPrecautionModal;
