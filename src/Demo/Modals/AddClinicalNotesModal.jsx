import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
  Typography
} from "antd";
import { useDispatch } from "react-redux";
import { PostClinicalNotes } from "../Redux/Slices/PatientHistorySlice";
import AddMedicineModal from "./AddMedicineModal";

const { Option } = Select;
const { Text } = Typography;

const AddClinicalNotesModal = ({ open, onClose, onClinicalNoteAdded, patientId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [clinicalNoteId, setClinicalNoteId] = useState(null);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        patient: patientId,
        pain: values.pain,
        pain_start_date: values.pain_start_date.format("YYYY-MM-DD"),
        pain_severity: values.pain_severity,
        observation: values.observation,
        diagnosis: values.diagnosis,
        evidence: values.evidence,
        treatment_plan: values.treatment_plan,
        advice: values.advice,
        remark: values.remark,
        next_followup_date: values.next_followup_date.format("YYYY-MM-DD"),
      };

      const result = await dispatch(PostClinicalNotes(payload)).unwrap();
      setClinicalNoteId(result.data.id);
      form.resetFields();
      onClose();
      setIsMedicineModalOpen(true);
    } catch (error) {
      message.error("Please fill all required fields.");
    }
  };

  return (
    <>
      <Modal
        open={open}
        title="Add Clinical Notes"
        onCancel={onClose}
        onOk={handleSubmit}
        okText="Submit"
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
        <Form form={form} layout="vertical">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <Form.Item
              name="pain"
              label="Pain"
              rules={[{ required: true }]}
              style={{ flex: "1 1 48%" }}
            >
              <Input placeholder="e.g., Headache" />
            </Form.Item>

            <Form.Item
              name="pain_start_date"
              label="Pain Start Date"
              rules={[{ required: true }]}
              style={{ flex: "1 1 48%" }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="pain_severity"
              label="Pain Severity"
              rules={[{ required: true }]}
              style={{ flex: "1 1 48%" }}
            >
              <Select placeholder="Select severity">
                <Option value="mild">Mild</Option>
                <Option value="moderate">Moderate</Option>
                <Option value="severe">Severe</Option>
                <Option value="unbearable">Unbearable</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="diagnosis"
              label="Diagnosis"
              rules={[{ required: true }]}
              style={{ flex: "1 1 48%" }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="observation"
              label="Observation"
              rules={[{ required: true }]}
              style={{ flex: "1 1 100%" }}
            >
              <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item
              name="evidence"
              label="Evidence"
              rules={[{ required: true }]}
              style={{ flex: "1 1 100%" }}
            >
              <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item
              name="treatment_plan"
              label="Treatment Plan"
              rules={[{ required: true }]}
              style={{ flex: "1 1 100%" }}
            >
              <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item
              name="advice"
              label="Doctor Advice"
              rules={[{ required: true }]}
              style={{ flex: "1 1 100%" }}
            >
              <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item
              name="remark"
              label="Personal Remark"
              rules={[{ required: true }]}
              style={{ flex: "1 1 100%" }}
            >
              <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item
              name="next_followup_date"
              label="Next Follow-up Date"
              rules={[{ required: true }]}
              style={{ flex: "1 1 48%" }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Add Medicine Modal */}
      <AddMedicineModal
        open={isMedicineModalOpen}
        onClose={() => setIsMedicineModalOpen(false)}
        patientId={patientId}
        clinicalNoteId={clinicalNoteId}
        onMedicineAdded={onClinicalNoteAdded}
      />
    </>
  );
};

export default AddClinicalNotesModal;
