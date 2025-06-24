import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PostDiseases, UpdateDiseasesStatus } from "../Redux/Slices/PatientHistorySlice";

const { Option } = Select;

const severityOptions = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
  { value: "critical", label: "Critical" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "recovered", label: "Recovered" },
  { value: "ongoing", label: "Ongoing" },
  { value: "chronic", label: "Chronic" },
];

const AddDiseasesModal = ({
  visible,
  onClose,
  onSuccess,
  patientId,
  editMode = false,
  disease,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.patienthistory);

  useEffect(() => {
    if (editMode && disease) {
      form.setFieldsValue({
        severity: disease.severity,
        status: disease.status,
      });
    } else {
      form.resetFields();
    }
  }, [editMode, disease, visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editMode && disease?.id) {
        await dispatch(UpdateDiseasesStatus({ id: disease.id, payload: values })).unwrap();
      } else {
        await dispatch(PostDiseases({ ...values, patient: patientId })).unwrap();
      }

      form.resetFields();
      onClose();
      if (onSuccess) onSuccess(); // ✅ fetch all detail history
    } catch (error) {
      message.error("Submission failed");
    }
  };

  return (
    <Modal
      title={editMode ? "Update Disease Status" : "Add Disease"}
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editMode ? "Update" : "Add"}
      centered
    >
      <Form layout="vertical" form={form}>
        {!editMode && (
          <Form.Item
            name="disease_name"
            label="Disease Name"
            rules={[{ required: true, message: "Please enter disease name" }]}
          >
            <Input placeholder="e.g. Hypertension" />
          </Form.Item>
        )}
        <Form.Item
          name="severity"
          label="Severity"
          rules={[{ required: true, message: "Please select severity" }]}
        >
          <Select placeholder="Select severity">
            {severityOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            {statusOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDiseasesModal;
