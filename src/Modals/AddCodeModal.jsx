import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { addCode } from "../Redux/Slices/codeSlice";

const AddCodeModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const formattedData = {
      book: parseInt(values.book, 10),
      code: values.code,
      description: values.description,
      sub_descriptions: values.sub_descriptions?.split(",").map((desc, index) => ({
        code: values.sub_descriptions_code?.split(",")[index] || `sub_${index + 1}`,
        sub_description: desc.trim(),
      })) || [],
    };

    try {
      const response = await dispatch(addCode(formattedData)).unwrap();
      message.success(response?.message || "Code added successfully!");
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error adding code:", error); // Log the error for debugging
      message.error(error?.message || "Failed to add code!");
    }
  };

  return (
    <Modal title="Add New Code" open={open} onCancel={onClose} footer={null}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Book" name="book" rules={[{ required: true, message: "Please input the book number!" }]}>
          <Input type="number" placeholder="Enter book number" />
        </Form.Item>
        <Form.Item label="Code" name="code" rules={[{ required: true, message: "Please input the code!" }]}>
          <Input placeholder="Enter code" />
        </Form.Item>
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
            Add Code
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCodeModal;