import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, verifyOtp } from "../Redux/Slices/authSlice";
import AddCounsellorDetailsModal from "./AddCounsellorDetailsModal";

const RegisterModal = ({ isModalVisible, setIsModalVisible }) => {
  const dispatch = useDispatch();
  const { loading, userId } = useSelector((state) => state.auth);

  const {Option} = Select
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [form] = Form.useForm();
  const [isCounsellorModalVisible, setIsCounsellorModalVisible] = useState(false);
  const [selectRole, setSelectRole] = useState("");

  const handleRegister = async (values) => {

    const updatedValues = {
      ...values,
      role: 'View'
    }

    try {
      const response = await dispatch(registerUser(updatedValues)).unwrap();
      message.success(response.message || "OTP sent to your email!");
      setEmail(values.email);
    } catch (error) {
      message.error(
        error?.error || error.username?.[0] || "Registration failed!"
      );
    }
  };

  const handleVerifyAndRegister = async () => {
    if (!otp) {
      message.error("Enter OTP first!");
      return;
    }

    try {
      await dispatch(verifyOtp({ user_id: userId, email_otp: otp })).unwrap();
      message.success("OTP Verified! Registration successful.");

      // if (selectRole === "Counsellor") {
      //   setIsCounsellorModalVisible(true);
      // } else {
        setIsModalVisible(false);
      // }
        } catch (error) {
        message.error(error?.message || "Invalid OTP, or user already verified");
    }
  };

  const handleSendOtp = () => {
    if (!email) return;
    setOtpSent(true);
  };

  return (
    <>
    <Modal
      title="Register"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleRegister} form={form}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter a username" }]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter a password" }]}
          hasFeedback
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Re-enter your password" />
        </Form.Item>

        <Form.Item label="Email" required>
          <Input.Group compact>
            <Form.Item
              name="email"
              noStyle
              rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
            >
              <Input
                style={{ width: "70%" }}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={() => {
                handleSendOtp();
                form.submit();
              }}
              style={{ width: "30%" }}
            >
              {otpSent ? "Resend OTP" : "Send OTP"}
            </Button>
          </Input.Group>
        </Form.Item>

        <Form.Item label="Enter OTP" name="otp">
          <Input
            placeholder="Enter the OTP sent to your email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </Form.Item>

        {/* <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select 
          placeholder="Select your role"
          onChange={(value) => setSelectRole(value)}
          >
            <Option value="Contributor">Contributor</Option>
            <Option value="Student">Student/User</Option>
            <Option value="Counsellor">Counsellor</Option>
          </Select> */}
        {/* </Form.Item> */}


        <Form.Item>
          <Button
            type="primary"
            block
            loading={loading}
            onClick={handleVerifyAndRegister}
          >
            Verify & Register
          </Button>
        </Form.Item>
      </Form>
    </Modal>
    
    <AddCounsellorDetailsModal 
      visible={isCounsellorModalVisible}
      onClose={() => {
        setIsCounsellorModalVisible(false);
        setIsModalVisible(false);
      }}
       userId={userId}
    />
    </>
  );
};

export default RegisterModal;
