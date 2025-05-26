import React, { useState, useEffect , useRef } from "react";
import { Modal, Form, Input, Button, Typography, message } from "antd";
import { MailOutlined, LockOutlined, ArrowLeftOutlined, KeyOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { sendResetOTP, verifyResetOTP, resetPassword, resetPasswordState } from "../Redux/Slices/authSlice";

const { Title, Text } = Typography;

const ForgotPasswordModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const dispatch = useDispatch();
  const otpInputRefs = useRef([]);
  const { resetPassword: resetState } = useSelector((state) => state.auth);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      dispatch(resetPasswordState());
      form.resetFields();
      setOtp(["", "", "", ""]);
    }
  }, [visible, dispatch, form]);

  useEffect(() => {
    otpInputRefs.current = otpInputRefs.current.slice(0, 6);
  }, []);

const handleEmailSubmit = ({ email }) => {
  dispatch(sendResetOTP({ email }))
    .unwrap()
    .then((payload) => {
      console.log("Send OTP Response:", payload); // Debug log
      message.success(payload.message || "OTP sent to your email");
    })
    .catch((err) => {
      console.error("Send OTP Error:", err); // Debug log
      message.error(err.message || "Failed to send OTP");
    });
};

const handleOtpSubmit = () => {
  if (otp.join("").length !== 6) {
    message.error("Please enter the 6-digit OTP");
    return;
  }
  dispatch(verifyResetOTP({ 
    email: resetState.email, 
    otp: otp.join("") 
  }))
    .unwrap()
    .then((payload) => {
      console.log("Verify OTP Response:", payload); // Debug log
      message.success(payload.message || "OTP verified");
    })
    .catch((err) => {
      console.error("Verify OTP Error:", err); // Debug log
      message.error(err.message || "OTP verification failed");
    });
};

const handlePasswordReset = ({ password, confirm }) => {
  dispatch(resetPassword({ 
    email: resetState.email, 
    new_password: password, 
    confirm_password: confirm 
  }))
    .unwrap()
    .then((payload) => {
      console.log("Reset Password Response:", payload); // Debug log
      message.success(payload.message || "Password reset successful!");
      onCancel();
    })
    .catch((err) => {
      console.error("Reset Password Error:", err); // Debug log
      message.error(err.message || "Password reset failed");
    });
};

   const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };
  const handleResendOTP = () => {
    dispatch(sendResetOTP({ email: resetState.email }))
      .unwrap()
      .then(() => message.success("New OTP sent to your email"))
      .catch((err) => message.error(err || "Failed to resend OTP"));
  };

  return (
    <Modal 
      open={visible} 
      onCancel={onCancel} 
      footer={null}
      centered
      destroyOnClose
    >
      <div style={{ textAlign: "center", padding: "20px" }}>
        {/* Step 1: Email Input */}
        {resetState.step === 1 && (
          <>
            <KeyOutlined style={{ fontSize: 32, marginBottom: 16 }} />
            <Title level={3}>Forgot password?</Title>
            {/* <Text>No worries, we'll send you reset instructions.</Text> */}
            <Form form={form} layout="vertical" onFinish={handleEmailSubmit} style={{ marginTop: 24 }}>
              <Form.Item 
                name="email" 
                label="Email" 
                rules={[
                  { required: true, message: "Please input your email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input placeholder="Enter your email" prefix={<MailOutlined />} />
              </Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
                loading={resetState.loading}
              >
                Send OTP
              </Button>
              <Button type="link" block onClick={onCancel} icon={<ArrowLeftOutlined />}>
                Back to log in
              </Button>
            </Form>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {resetState.step === 2 && (
          <>
            <MailOutlined style={{ fontSize: 32, marginBottom: 16 }} />
            <Title level={3}>Password reset</Title>
            <Text>We sent a code to {resetState.email}</Text>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: 20 }}>
               {[0, 1, 2, 3, 4, 5].map((i) => (
            <Input
            key={i}
            value={otp[i]}
            ref={(el) => (otpInputRefs.current[i] = el)}
            onChange={(e) => handleOtpChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            maxLength={1}
            style={{ width: 50, textAlign: "center", fontSize: 24 }}
            />
        ))}
            </div>
            <Button 
              type="primary" 
              block 
              style={{ marginTop: 20 }} 
              onClick={handleOtpSubmit}
              loading={resetState.loading}
            >
              Continue
            </Button>
            <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
              Didn't receive the email? <a onClick={handleResendOTP}>Click to resend</a>
            </Text>
            <Button 
              type="link" 
              block 
              onClick={() => dispatch(setResetPasswordStep(1))} 
              icon={<ArrowLeftOutlined />}
            >
              Back to email input
            </Button>
          </>
        )}

        {/* Step 3: New Password */}
        {resetState.step === 3 && (
          <>
            <LockOutlined style={{ fontSize: 32, marginBottom: 16 }} />
            <Title level={3}>Set new password</Title>
            {/* <Text>Must be at least 8 characters.</Text> */}
            <Form form={form} layout="vertical" onFinish={handlePasswordReset} style={{ marginTop: 24 }}>
              <Form.Item
                name="password"
                label="New Password"
                rules={[
                  { required: true, message: "Please input your new password" },
                //   { message: "Password ers" }
                ]}
              >
                <Input.Password placeholder="New password" />
              </Form.Item>
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
                loading={resetState.loading}
              >
                Reset password
              </Button>
              <Button 
                type="link" 
                block 
                onClick={() => dispatch(setResetPasswordStep(2))} 
                icon={<ArrowLeftOutlined />}
              >
                Back to OTP verification
              </Button>
            </Form>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;