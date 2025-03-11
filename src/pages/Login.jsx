import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, verifyOtp } from "../Redux/Slices/authSlice";
import { setUserData } from "../Redux/Slices/profileSlice";

//const { Option } = Select;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, userId } = useSelector((state) => state.auth);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setotpSent] = useState(false);
  const [form] = Form.useForm();

  const handleRegister = async (values) => {
    try {
      const response = await dispatch(registerUser(values)).unwrap();
      //console.log("Registration Response:", response);
      message.success(response.message || "OTP sent to your email!");
      setEmail(values.email);
      //setotpSent(true); // ✅ Update state to change button label
    } catch (error) {
      //console.error("Registration Error:", error);
      message.error(error?.error || error.username[0] || "Registration failed!");
    }
  };
  

  // 🔹 Handle Verify OTP & Complete Registration
  const handleVerifyAndRegister = async () => {
    if (!otp) {
      message.error("Enter OTP first!");
      return;
    }

    try {
      await dispatch(verifyOtp({ user_id: userId, email_otp: otp })).unwrap();
      message.success("OTP Verified! Registration successful.");
      setIsModalVisible(false);
    } catch (error) {
      message.error(error?.message || "Invalid OTP, or user already verified");
    }
  };

    // 🔹 Handle Login with Messages
    const handleLogin = async (values) => {
      try {
        const response = await dispatch(loginUser(values)).unwrap();
       // console.log("Login Response:", response);
        message.success(response?.message || "Login successful!");
        //dispatch(loginSuccess(response.user));
        setTimeout(() => navigate("/profile"), 1500);

      } catch (error) {
        //console.log("Login Error:", error);
        message.error(error?.error || "Invalid email or password");
      }
    };

    const handleLoginSuccess = (user) => {
      dispatch(setUserData({ name: user.username, email: user.email }));
    };

     // 🔹 Handle OTP Button Click
     const handleSendOtp = () => {
      if (!email) return;
      setotpSent(true); // ✅ Change button text to "Resend OTP"
    };
    
    

  return (
    <div style={{overflow: "hidden"}}>
    <Card title="Login" style={{ width: 350, margin: "100px auto"}}>
      <Form layout="vertical" onFinish={handleLogin}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>

          {/* 🔹 Role Selection Field */}
          {/* <Form.Item label="Role" name="role" rules={[{ required: true, message: "Please select a role!" }]}>
          <Select placeholder="Select Role">
            <Option value="admin">Admin</Option>
            <Option value="viewer">Viewer</Option>
            <Option value="editor">Editor</Option>
          </Select>
        </Form.Item> */}

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>

      <p>
        Don't have an account?{" "}
        <Button type="link" onClick={() => setIsModalVisible(true)}>
          Register
        </Button>
      </p>

      {/* 🔹 Registration Modal */}
      <Modal title="Register" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form layout="vertical" onFinish={handleRegister} form={form}>
          <Form.Item label="Username" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>


          <Form.Item label="Email" required>
    <Input.Group compact>
      <Form.Item name="email" noStyle rules={[{ required: true, type: "email" }]}>
        <Input 
        style={{ width: "70%" }} 
        onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>
      <Button type="primary" onClick={() => {
        handleSendOtp();
        form.submit();}}
       style={{ width: "30%" }}
       >
        {otpSent ? "Resend OTP" : "Send OTP"}
      </Button>
    </Input.Group>
  </Form.Item>

                {/* 🔹 OTP Input & Send OTP Button */}
          <Form.Item label="Enter OTP" name="otp">
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              // enterButton={
              //   <Button type="primary" onClick={() => form.submit()}>
              //     Send OTP
              //   </Button>
              // }
            />
          </Form.Item>

         
    

          <Form.Item>
            <Button type="primary" block loading={loading} onClick={handleVerifyAndRegister}>
              Verify & Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
    </div>
  );
};

export default Login;
