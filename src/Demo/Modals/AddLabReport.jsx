import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, Button, Select, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";
import { postLabReport } from "../Redux/Slices/ReportSlice";

const { Option } = Select;

const AddLabReport = ({ visible, onClose, uploadedById }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
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
    }, [dispatch, visible]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append("patient", values.patient);
            formData.append("uploaded_by", uploadedById);
            formData.append("report_name", values.report_name);
            formData.append("description", values.description);
            if (fileList[0]) {
                formData.append("file", fileList[0].originFileObj);
            }

            await dispatch(postLabReport(formData)).unwrap();
            form.resetFields();
            setFileList([]);
            onClose();
        } catch (error) {
            message.error("Failed to upload report.");
        }
    };

    return (
        <Modal
            title="Add Lab Report"
            open={visible}
            onCancel={() => {
                form.resetFields();
                setFileList([]);
                onClose();
            }}
            onOk={handleSubmit}
            okText="Submit"
        >
            {loading ? (
                <Spin tip="Loading patients..." />
            ) : (
                <Form layout="vertical" form={form}>
                    <Form.Item
                        label="Patient"
                        name="patient"
                        rules={[{ required: true, message: "Please select a patient" }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select patient"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {Array.isArray(patients) && patients.map((patient) => (
                                <Option key={patient.id} value={patient.id}>
                                    {patient.full_name}
                                </Option>
                            ))}

                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Report Name"
                        name="report_name"
                        rules={[{ required: true, message: "Please enter report name" }]}
                    >
                        <Input placeholder="e.g., CBC Report" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please enter description" }]}
                    >
                        <Input.TextArea rows={3} placeholder="e.g., Routine blood test" />
                    </Form.Item>

                    <Form.Item
                        label="Upload File"
                        name="file"
                        rules={[{ required: true, message: "Please upload a file" }]}
                    >
                        <Upload
                            beforeUpload={() => false}
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default AddLabReport;
