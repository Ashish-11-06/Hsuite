import React from "react";
import { Modal, Form, Input, Button } from "antd";

const EditCodeModal = ({ open, onClose, code, onEdit }) => {
    const [form] = Form.useForm();

    console.log(code);

    React.useEffect(() => {
        if (code) {
            form.setFieldsValue({
                description: code.description,
                sub_descriptions: code.sub_descriptions.map(sub => sub.sub_description).join(", "),
                sub_descriptions_code: code.sub_descriptions.map(sub => sub.code).join(", "),
            });
        }
    }, [code, form]);

    const onFinish = (values) => {
        // console.log(values);
        const updatedData = {
            id: code?.id,
            description: values.description,
            sub_descriptions: values.sub_descriptions.split(",").map((desc, index) => ({
                code: values.sub_descriptions_code.split(",")[index] || `sub_${index + 1}`,
                sub_description: desc.trim(),
            })),
        };
        console.log("Form values submitted:", values); // Log the form values
        console.log("Updated data prepared for submission:", updatedData);
        onEdit(updatedData);
    };

    return (
        <Modal title="Edit Code" open={open} onCancel={onClose} footer={null}>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please input the description!" }]}>
                    <Input placeholder="Enter description" />
                </Form.Item>
                <Form.Item label="Sub-Descriptions" name="sub_descriptions">
                    <Input placeholder="Enter sub-descriptions" />
                </Form.Item>
                <Form.Item label="Sub-Description Codes" name="sub_descriptions_code">
                    <Input placeholder="Enter sub-description codes" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Code
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditCodeModal;