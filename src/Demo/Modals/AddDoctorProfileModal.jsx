import React, { useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    DatePicker,
    Upload,
    Button,
    Select,
    InputNumber,
    message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { PostDoctorProfile, UpdateDoctorProfile, GetHMSUserByIdAndHospital } from "../Redux/Slices/UsersSlice";
import dayjs from "dayjs";

const { Option } = Select;

const AddDoctorProfileModal = ({ visible, setVisible, isEditMode, existingData }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    useEffect(() => {
        if (isEditMode && existingData) {
            form.setFieldsValue({
                phone_number: existingData.phone_number,
                gender: existingData.gender,
                dob: existingData.dob ? dayjs(existingData.dob) : null,
                qualification: existingData.qualification,
                specialization: existingData.specialization,
                experience_years: existingData.experience_years,
            });
        } else {
            form.resetFields();
        }
    }, [isEditMode, existingData, form]);

    const handleFinish = async (values) => {
        const userId = JSON.parse(localStorage.getItem("HMS-user"))?.id;
        const formData = new FormData();

        formData.append("doctor", userId); // ✅ Doctor field in FormData
        formData.append("phone_number", values.phone_number);
        formData.append("gender", values.gender);
        formData.append("dob", values.dob.format("YYYY-MM-DD"));

        const photoFile = values.photo?.[0]?.originFileObj;
        if (photoFile) {
            formData.append("photo", photoFile);
        }

        formData.append("qualification", values.qualification);
        formData.append("specialization", values.specialization);
        formData.append("experience_years", values.experience_years);

        try {
            if (isEditMode) {
                await dispatch(UpdateDoctorProfile({ user_id: userId, data: formData })).unwrap();
            } else {
                await dispatch(PostDoctorProfile(formData)).unwrap();
            }

            await dispatch(GetHMSUserByIdAndHospital(userId)).unwrap();
            form.resetFields();
            setVisible(false);
        } catch (error) {
            // console.error("Error:", error);
            // message.error("Failed to save profile");
        }
    };


    return (
        <Modal
            title={isEditMode ? "Edit Doctor Profile" : "Add Doctor Profile"}
            open={visible}
            onCancel={() => setVisible(false)}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                    <Select placeholder="Select gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="photo" label="Photo" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload beforeUpload={() => false} maxCount={1}>
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>


                <Form.Item name="qualification" label="Qualification" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="specialization" label="Specialization" rules={[{ required: true }]}>
                    <Select placeholder="Select specialization">
                        <Option value="cardiology">Cardiology</Option>
                        <Option value="neurology">Neurology</Option>
                        <Option value="orthopedics">Orthopedics</Option>
                        <Option value="pediatrics">Pediatrics</Option>
                        <Option value="gynecology">Gynecology</Option>
                        <Option value="dermatology">Dermatology</Option>
                        <Option value="psychiatry">Psychiatry</Option>
                        <Option value="general_medicine">General Medicine</Option>
                        <Option value="ent">ENT</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>


                <Form.Item name="experience_years" label="Experience (years)" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        {isEditMode ? "Update" : "Submit"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddDoctorProfileModal;
