import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, DatePicker, Spin, message, } from "antd";
import { useDispatch } from "react-redux";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";
import { postBirthReport } from "../Redux/Slices/ReportSlice";

const { Option } = Select;

const AddBirthReportModal = ({ visible, onClose, uploadedById, onSuccess }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const res = await dispatch(fetchAllPatients()).unwrap();
                setPatients(res.patients);
            } catch (err) {
                message.error("Failed to fetch patients");
            } finally {
                setLoading(false);
            }
        };

        if (visible) {
            fetchPatients();
        }
    }, [visible, dispatch]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const user = JSON.parse(localStorage.getItem("HMS-user"));
            const created_by = user?.id;

            if (!created_by) {
                message.error("user not found");
                return;
            }

            const payload = {
                ...values,
                created_by: uploadedById,
                date_of_birth: values.dob_child.format("YYYY-MM-DD"),
            };

            await dispatch(postBirthReport(payload)).unwrap();
            form.resetFields();
            onClose();
            if (typeof onSuccess === "function") onSuccess();
        } catch (err) {
            message.error(err?.message || "Failed to submit birth report");
        }
    };

    return (
        <Modal
            title="Add Birth Report"
            open={visible}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            onOk={handleSubmit}
            okText="Submit"
        >
            {loading ? (
                <Spin tip="Loading patients...">
                    <div style={{height: 100}}></div>
                </Spin>
            ) : (
                <Form layout="vertical" form={form}>
                    <Form.Item
                        label="Patient"
                        name="patient"
                        rules={[{ required: true, message: "Please select a patient" }]}
                    >
                        <Select showSearch placeholder="Select patient" optionFilterProp="children">
                            {Array.isArray(patients) &&
                                patients.map((patient) => (
                                    <Option key={patient.id} value={patient.id}>
                                        {patient.full_name}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Child Name"
                        name="child_name"
                        rules={[{ required: true, message: "Please enter child's name" }]}
                    >
                        <Input placeholder="e.g., Baby Sharma" />
                    </Form.Item>

                    <Form.Item
                        label="Gender"
                        name="gender"
                        rules={[{ required: true, message: "Please select gender" }]}
                    >
                        <Select placeholder="Select gender">
                            <Option value="Male">Male</Option>
                            <Option value="Female">Female</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Date of Birth"
                        name="dob_child"
                        rules={[{ required: true, message: "Please select date of birth" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Birth Place"
                        name="birth_place"
                        rules={[{ required: true, message: "Please enter birth place" }]}
                    >
                        <Input placeholder="e.g., Sancheti Hospital, Pune" />
                    </Form.Item>

                    <Form.Item
                        label="Father Name"
                        name="father_name"
                        rules={[{ required: true, message: "Please enter father's name" }]}
                    >
                        <Input placeholder="e.g., Rahul Sharma" />
                    </Form.Item>

                    <Form.Item
                        label="Weight (kg)"
                        name="weight"
                        rules={[{ required: true, message: "Please enter weight" }]}
                    >
                        <Input placeholder="e.g., 3.2" />
                    </Form.Item>

                    <Form.Item
                        label="Remark"
                        name="remark"
                        rules={[{ required: true, message: "Please enter remarks" }]}
                    >
                        <Input.TextArea rows={3} placeholder="e.g., Normal delivery" />
                    </Form.Item>
                </Form>

            )}
        </Modal>
    );
};

export default AddBirthReportModal;
