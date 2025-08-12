import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  patientForgotPassword,
  patientPasswordVerifyOtp,
  patientResetPassword,
} from "../Redux/Slices/PatientRegisterSlice";

const PatientForgotPasswordModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [patientId, setPatientId] = useState(null);

  const handleForgotPassword = async (values) => {
    const result = await dispatch(patientForgotPassword(values));
    if (result?.payload?.patient_id) {
      setPatientId(result.payload.patient_id);
      setEmail(values.email);
      setCurrentStep(2);
    } else {
      message.error(result?.payload?.error || "Something went wrong");
    }
  };

  const handleVerifyOtp = async (values) => {
    const result = await dispatch(
      patientPasswordVerifyOtp({ patient_id: patientId, otp: values.otp })
    );
    if (result?.payload?.message === "OTP verified successfully") {
      setCurrentStep(3);
    } else {
      message.error(result?.payload?.error || "OTP verification failed");
    }
  };

  const handleResetPassword = async (values) => {
    const result = await dispatch(
      patientResetPassword({
        patient_id: patientId,
        new_password: values.new_password,
      })
    );
    if (result?.payload?.message) {
      message.success("Password reset successful");
      form.resetFields();
      setCurrentStep(1);
      onClose(); // Close parent modal
    } else {
      message.error(result?.payload?.error || "Password reset failed");
    }
  };

  return (
    <>
      {/* Step 1 - Forgot Password */}
      <Modal
        open={open && currentStep === 1}
        onCancel={onClose}
        footer={null}
        title="Forgot Password"
      >
        <Form form={form} onFinish={handleForgotPassword} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" block>
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Step 2 - Verify OTP */}
      <Modal
        open={currentStep === 2}
        onCancel={() => setCurrentStep(1)}
        footer={null}
        title="Verify OTP"
      >
        <Form onFinish={handleVerifyOtp} layout="vertical">
          <Form.Item
            label="OTP"
            name="otp"
            rules={[{ required: true, message: "Please enter OTP" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" block>
              Verify
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Step 3 - Reset Password */}
      <Modal
        open={currentStep === 3}
        onCancel={() => setCurrentStep(2)}
        footer={null}
        title="Reset Password"
      >
        <Form onFinish={handleResetPassword} layout="vertical">
          <Form.Item
            label="New Password"
            name="new_password"
            rules={[{ required: true, message: "Please enter new password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" block>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PatientForgotPasswordModal;
