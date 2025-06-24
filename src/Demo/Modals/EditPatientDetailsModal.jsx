import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { UpdatePatientDetails, fetchAllPatients } from "../Redux/Slices/PatientSlice";

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


  return (
    <Modal
      title="Edit Patient Details"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="full_name" label="Full Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="dob" label="DOB" rules={[{ required: true }]}>
          <Input type="date" />
        </Form.Item>

        <Form.Item name="age" label="Age" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} disabled />
        </Form.Item>

        <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="contact_number" label="Contact Number" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: false, type: "email" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="relative_name" label="Relative Name" rules={[{ required: false }]}>
          <Input />
        </Form.Item>

        <Form.Item name="emergency_contact_number" label="Emergency Contact Number" rules={[{ required: false }]}>
          <Input />
        </Form.Item>

        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="blood_group" label="Blood Group" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="known_allergies" label="Known Allergies">
          <Input />
        </Form.Item>

        <Form.Item name="medical_history" label="Medical History">
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save Changes
          </Button>
        </Form.Item>
      </Form>

    </Modal>
  );
};

export default EditPatientDetailsModal;
