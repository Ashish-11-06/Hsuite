import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { addCode } from "../Redux/Slices/codeSlice";

const AddCodeModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const formattedData = {
      book: parseInt(values.book, 10), // Ensure book is a number
      code: values.code,
      description: values.description,
      sub_descriptions: [], // Placeholder, modify if needed
    };
  
    try {
      const response = await dispatch(addCode(formattedData)).unwrap(); // Dispatch to Redux and wait for the result
      message.success(response.message || "Code added successfully!");
  
      form.resetFields();
      onCancel(); // Close the modal
    } catch (error) {
      console.error("Error adding code:", error);
    }
  };

  return (
    <Modal title="Add New Code" open={visible} onCancel={onCancel} footer={null}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Book"
          name="book"
          rules={[{ required: true, message: "Please input the book number!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Please input the code!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCodeModal;
