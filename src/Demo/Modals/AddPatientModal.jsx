import React from "react";
import { Modal, Form, Input, Select, message, DatePicker } from "antd";
import { useDispatch } from "react-redux";
import { postPatientDetails, fetchAllPatients } from "../Redux/Slices/PatientSlice";

const { Option } = Select;

const GENDER_CHOICES = ["Male", "Female", "Other"];
const BLOOD_GROUP_CHOICES = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

const AddPatientModal = ({ visible, onCancel, isEditing = false }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleFinish = async (values) => {
    const payload = {
      full_name: values.name,
      gender: values.gender,
      age: values.age,
      contact_number: values.contact,
      email: values.email,
      emergency_contact_number: values.emergencyContact,
      address: values.address,
      blood_group: values.bloodGroup,
      known_allergies: values.allergies,
      medical_history: values.medicalHistory,
      dob: values.dob?.format("YYYY-MM-DD"),
      relative_name: values.relativeName,
    };

    try {
      const res = await dispatch(postPatientDetails(payload)).unwrap();
      message.success(res?.message || "Patient added successfully");
      form.resetFields();
      dispatch(fetchAllPatients());
      onCancel();
    } catch (err) {
      message.error(err?.message || "Failed to add patient");
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Patient" : "Add Patient"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.validateFields().then(handleFinish)}
      okText={isEditing ? "Update" : "Add"}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender" }]}
        >
          <Select placeholder="Select gender">
            {GENDER_CHOICES.map((gender) => (
              <Option key={gender} value={gender}>{gender}</Option>
            ))}
          </Select>
        </Form.Item>


        <Form.Item
          name="dob"
          label="DOB"
          rules={[{ required: true, message: "Please enter DOB" }]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD"
            onChange={(date) => {
              if (date) {
                const age = new Date().getFullYear() - date.year();
                form.setFieldsValue({ age });
              }
            }} />
        </Form.Item>

        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: "Please enter age" }]}
        >
          <Input type="number" disabled />
        </Form.Item>

        <Form.Item
          name="contact"
          label="Contact Number"
          rules={[
            { required: true, message: "Please enter contact number" },
            { pattern: /^\d{10}$/, message: "Enter a valid 10-digit number" },
          ]}
        >
          <Input maxLength={10} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: false, message: "Please enter email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="emergencyContact"
          label="Emergency Contact Number"
          rules={[
            { required: false, message: "Please enter emergency contact number" },
            { pattern: /^\d{10}$/, message: "Enter a valid 10-digit number" },
          ]}
        >
          <Input maxLength={10} />
        </Form.Item>


        <Form.Item
          name="relativeName"
          label="Relative Name"
          rules={[{ message: "Please enter Relative Name" }]}
        >
          <Input type="text" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          name="bloodGroup"
          label="Blood Group"
          rules={[{ required: false, message: "Please select blood group" }]}
        >
          <Select placeholder="Select blood group">
            {BLOOD_GROUP_CHOICES.map((group) => (
              <Option key={group} value={group}>{group}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="allergies"
          label="Known Allergies"
          rules={[{ required: false, message: "Please enter known allergies" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="medicalHistory"
          label="Medical History"
          rules={[{ required: false, message: "Please enter medical history" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPatientModal;
