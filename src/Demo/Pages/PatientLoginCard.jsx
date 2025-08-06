import React, { useState } from "react";
import { Card, Input, Button, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { patientLogin } from "../Redux/Slices/PatientRegisterSlice";
import PatientRegisterModal from "../Modals/PatientRegisterModal";
import PatientForgotPasswordModal from "../Modals/PatientForgotPasswordModal";

const { Title, Text, Link } = Typography;

const PatientLoginCard = ({ hospitalId, onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [forgotOpen, setForgotOpen] = useState(false);

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.patientRegister);

    const handleLogin = async () => {
        if (!email || !password) {
            message.error("Please enter email and password");
            return;
        }

        const result = await dispatch(
            patientLogin({
                body: { email, password },
                hospitalId,
            })
        );

        if (result.type.includes("fulfilled")) {
            // setIsLoggedIn(true);
            const userData = result.payload.patient;
            localStorage.setItem("patient-user", JSON.stringify(userData));
            onLoginSuccess();
            // message.success("Login successful!");
        } else {
            message.error("Login failed: " + (result.payload || "Unknown error"));
        }
    };

    // if (isLoggedIn) {
    //     return <PatientSidebar />
    // }

    return (
        <>
            <Card
                style={{
                    width: 400,
                    margin: "80px auto",
                    padding: 32,
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                variant="borderless"
                loading={loading}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={3} style={{ margin: 0 }}>
                        Login
                    </Title>
                    <Text type="secondary">Enter your credentials to login to your account</Text>
                </div>

                <Input
                    placeholder="example.email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: 16 }}
                />
                <Input.Password
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginBottom: 8 }}
                />

                <div style={{ textAlign: "right", marginBottom: 16 }}>
                    <Link onClick={() => setForgotOpen(true)}>Forgot Password?</Link>
                </div>

                <Button type="primary" block onClick={handleLogin} style={{ marginBottom: 16 }}>
                    Sign In
                </Button>

                <div style={{ textAlign: "center" }}>
                    <Text>Don’t have an account? </Text>
                    <Link onClick={() => setIsModalVisible(true)}>Sign Up</Link>
                </div>
            </Card>

            {/* Modals */}
            <PatientRegisterModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                hospitalId={hospitalId}
            />
            <PatientForgotPasswordModal
                open={forgotOpen}
                onClose={() => setForgotOpen(false)}
            />
        </>
    );
};

export default PatientLoginCard;
