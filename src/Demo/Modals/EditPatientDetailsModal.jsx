import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { UpdatePatientDetails, fetchAllPatients } from "../Redux/Slices/PatientSlice";

const { Option } = Select;

const EditPatientDetailsModal = ({ visible, onCancel, patient }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (patient) {
      form.setFieldsValue(patient);
    }
  }, [patient, form]);

  const onFinish = (values) => {
    dispatch(UpdatePatientDetails({ patient_id: patient.id, ...values }))
      .then((action) => {
        if (action.type.endsWith("fulfilled")) {
          message.success(action.payload?.message || "Patient updated successfully");
          dispatch(fetchAllPatients());
          onCancel();
        } else {
          message.error(action.payload?.message || "Failed to update patient");
        }
      });
  };

  const GENDER_CHOICES = ["Male", "Female", "Other"];
  const BLOOD_GROUP_CHOICES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <Modal
      title="Edit Patient Details"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      styles={{body:{maxHeight: "70vh", overflowY: "auto", paddingRight: 12},}}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <Form.Item name="full_name" label="Full Name" rules={[{ required: true }]} style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="dob" label="DOB" rules={[{ required: true }]} style={{ flex: "1 1 48%" }}>
            <Input type="date" />
          </Form.Item>

          <Form.Item name="age" label="Age" style={{ flex: "1 1 48%" }}>
            <InputNumber min={0} style={{ width: "100%" }} disabled />
          </Form.Item>

          <Form.Item name="gender" label="Gender" rules={[{ required: true }]} style={{ flex: "1 1 48%" }}>
            <Select placeholder="Select gender">
              {GENDER_CHOICES.map((gender) => (
                <Option key={gender} value={gender}>{gender}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="contact_number" label="Contact Number" rules={[{ required: true }]} style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ type: "email" }]} style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="emergency_contact_number" label="Emergency Contact Number" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="relative_name" label="Relative Name" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Address" rules={[{ required: true }]} style={{ flex: "1 1 100%" }}>
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="blood_group" label="Blood Group" rules={[{ required: true }]} style={{ flex: "1 1 48%" }}>
            <Select placeholder="Select blood group">
              {BLOOD_GROUP_CHOICES.map((group) => (
                <Option key={group} value={group}>{group}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="known_allergies" label="Known Allergies" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="medical_history" label="Medical History" style={{ flex: "1 1 100%" }}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </div>

        <Form.Item style={{ marginTop: 12 }}>
          <Button type="primary" htmlType="submit" block>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPatientDetailsModal;
