import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
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
      onOk={handleSubmit}
      okText="Save"
      width={800}
      styles={{
        body: {
          maxHeight: "70vh",
          overflowY: "auto",
          paddingRight: 12,
        },
        content: {
          overflow: "hidden",
        },
      }}
    >
      <Form layout="vertical" form={form}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <Form.Item label="Temperature" name="temperature" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="Pulse" name="pulse" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="Blood Pressure" name="blood_pressure" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="Weight" name="weight" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="Height" name="height" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="CNS" name="cns" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="RS" name="rs" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="PA" name="pa" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="WBC" name="wbc" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="RBC" name="rbc" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default EditFindingModal;
