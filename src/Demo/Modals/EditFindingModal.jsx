import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";
import { useDispatch } from "react-redux";
import { UpdateFinding, GetFinding } from "../Redux/Slices/PatientHistorySlice";

const EditFindingModal = ({ open, onClose, finding, patientId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (finding) {
      form.setFieldsValue(finding);
    }
  }, [finding, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload = { ...finding, ...values };
      dispatch(UpdateFinding({ id: finding.id, payload })).then(() => {
        dispatch(GetFinding(patientId));
        onClose();
      });
    });
  };


  return (
    <Modal
      open={open}
      title="Edit Finding"
      onCancel={onClose}
      footer={[
        <Button onClick={onClose}>Cancel</Button>,
        <Button type="primary" onClick={handleSubmit}>Save</Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Temperature" name="temperature">
          <Input />
        </Form.Item>
        <Form.Item label="Pulse" name="pulse">
          <Input />
        </Form.Item>
        <Form.Item label="Blood Pressure" name="blood_pressure">
          <Input />
        </Form.Item>
        <Form.Item label="Weight" name="weight">
          <Input />
        </Form.Item>
        <Form.Item label="Height" name="height">
          <Input />
        </Form.Item>
        <Form.Item label="CNS" name="cns">
          <Input />
        </Form.Item>
        <Form.Item label="RS" name="rs">
          <Input />
        </Form.Item>
        <Form.Item label="PA" name="pa">
          <Input />
        </Form.Item>
        <Form.Item label="WBC" name="wbc">
          <Input />
        </Form.Item>
        <Form.Item label="RBC" name="rbc">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditFindingModal;
