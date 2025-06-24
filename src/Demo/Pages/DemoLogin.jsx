import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { postUserLogin } from "../Redux/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const DemoLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleFinish = async (values) => {
    try {
      const res = await dispatch(postUserLogin(values)).unwrap();
      // message.success("Login successful!");
      console.log("User data:", res);
      const hospital = res?.hospital; // Assuming the response contains hospital data
      const hms_user = res?.hms_user; // Assuming the response contains user data
      if(res){
        localStorage.setItem("Hospital-Id", JSON.stringify(hospital?.hospital_id));
        localStorage.setItem("HMS-user", JSON.stringify(hms_user));
            }

      navigate("/demo/demohome");
    } catch (error) {
      // message.error(error?.message || "Login failed");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <Card style={{ width: 400 }}>
        <Title level={3}>Login</Title>
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DemoLogin;
