import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Row, Col, DatePicker, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
    patientRegistration,
    patientVerifyOtp,
} from "../Redux/Slices/PatientRegisterSlice";
import dayjs from "dayjs";

const PatientRegisterModal = ({ visible, onCancel, hospitalId }) => {
    const dispatch = useDispatch();
    const { loading, userId } = useSelector((state) => state.patientRegister);

    const [form] = Form.useForm();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [patientId, setPatientId] = useState(null);

    // Send registration request and trigger OTP
    const handleRegister = async (values) => {
        const payload = {
            ...values,
            dob: values.dob.format("YYYY-MM-DD"),
            hospital_id: hospitalId,
        };

        try {
            const response = await dispatch(patientRegistration(payload)).unwrap();
            // message.success("OTP sent to your email!");
            setOtpSent(true);
            setEmail(values.email);
            setPatientId(response.patient_id);
        } catch (error) {
            // message.error(error?.message || "Registration failed");
        }
    };

    // OTP verification
    const handleVerifyAndRegister = async () => {
        if (!otp) {
            return message.error("Please enter OTP");
        }

        try {
            const payload = {
                patient_id: patientId,
                email_otp: otp,
            };

            await dispatch(patientVerifyOtp(payload)).unwrap();
            // message.success("OTP Verified! Registration successful.");
            onCancel(); // Close modal on success
        } catch (error) {
            message.error(error?.message || "OTP verification failed");
        }
    };

    const handleSendOtpClick = () => {
        form.submit(); // Triggers handleRegister
    };

    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            footer={null}
            title="Patient Registration"
            centered
            width={600}
        >
            <Form layout="vertical" form={form} onFinish={handleRegister}>
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="full_name"
                            label="Full Name"
                            rules={[{ required: true, message: "Enter your name" }]}
                        >
                            <Input placeholder="Enter full name" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="dob"
                            label="Date of Birth"
                            rules={[{ required: true, message: "Enter DOB" }]}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                format="YYYY-MM-DD"
                                disabledDate={(current) => current && current > dayjs().endOf("day")}
                            />
                        </Form.Item>

                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[{ required: true, message: "Please select gender" }]}
                        >
                            <Select placeholder="Select gender">
                                <Select.Option value="Male">Male</Select.Option>
                                <Select.Option value="Female">Female</Select.Option>
                                <Select.Option value="Other">Other</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="contact_number"
                            label="Contact Number"
                            rules={[{ required: true, message: "Enter contact number" }]}
                        >
                            <Input placeholder="Enter mobile number" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Email" required>
                    <Input.Group compact>
                        <Form.Item
                            name="email"
                            noStyle
                            rules={[
                                { required: true, type: "email", message: "Enter a valid email" },
                            ]}
                        >
                            <Input
                                style={{ width: "70%" }}
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={handleSendOtpClick}
                            style={{ width: "30%" }}
                            loading={loading}
                        >
                            {otpSent ? "Resend OTP" : "Send OTP"}
                        </Button>
                    </Input.Group>
                </Form.Item>

                <Form.Item label="OTP">
                    <Input
                        placeholder="Enter the OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: "Enter a password" },
                        // {
                        //   pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
                        //   message:
                        //     "Min 6 characters, include 1 uppercase, 1 number & 1 special character",
                        // },
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        { required: true, message: "Confirm your password" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || value === getFieldValue("password")) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords do not match"));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Re-enter password" />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: "Enter address" }]}
                >
                    <Input.TextArea placeholder="Enter your address" rows={2} />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        block
                        onClick={handleVerifyAndRegister}
                        loading={loading}
                    >
                        Verify & Register
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PatientRegisterModal;
