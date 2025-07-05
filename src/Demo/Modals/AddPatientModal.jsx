import React from "react";
import { Modal, Form, Input, Select, message, DatePicker } from "antd";
import { useDispatch } from "react-redux";
import { postPatientDetails, fetchAllPatients } from "../Redux/Slices/PatientSlice";

const { Option } = Select;

const GENDER_CHOICES = ["Male", "Female", "Other"];
const BLOOD_GROUP_CHOICES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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
      width={800}
      styles={{
        body: { maxHeight: "65vh", overflowY: "auto", paddingRight: 12, },
      }}
    >
      <Form form={form} layout="vertical" style={{ marginBottom: 0, marginTop: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <Form.Item
            name="name"
            label="Full Name"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            style={{ flex: "1 1 48%" }}
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
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true, message: "Please enter DOB" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              onChange={(date) => {
                if (date) {
                  const age = new Date().getFullYear() - date.year();
                  form.setFieldsValue({ age });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="age"
            label="Age"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true, message: "Please enter age" }]}
          >
            <Input type="number" disabled />
          </Form.Item>

          <Form.Item
            name="contact"
            label="Contact Number"
            style={{ flex: "1 1 48%" }}
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
            style={{ flex: "1 1 48%" }}
            rules={[
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="emergencyContact"
            label="Emergency Contact Number"
            style={{ flex: "1 1 48%" }}
            rules={[
              { pattern: /^\d{10}$/, message: "Enter a valid 10-digit number" },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>

          <Form.Item
            name="relativeName"
            label="Relative Name"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            style={{ flex: "1 1 100%" }}
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="bloodGroup"
            label="Blood Group"
            style={{ flex: "1 1 48%" }}
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
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="medicalHistory"
            label="Medical History"
            style={{ flex: "1 1 100%" }}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddPatientModal;
