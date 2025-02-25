import React from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addCode } from "../Redux/codeSlice";

const { Option } = Select;

const AddCodeModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books); // Fetch stored books from Redux

  // Handle form submission
  const handleSubmit = (values) => {
    dispatch(addCode(values)); // Save data in Redux store
    message.success("Code added successfully!");
    form.resetFields(); // Reset form after submission
    onClose(); // Close modal
  };

  return (
    <Modal title="Add Code" open={open} onCancel={onClose} footer={null}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {/* Dropdown with type support for selecting books */}
        <Form.Item name="book" label="Book" rules={[{ required: true, message: "Please select or enter a book name" }]}>
          <Select
            showSearch
            placeholder="Select or type book name"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            {books.map((book) => (
              <Option key={book.id} value={book.name}>
                {book.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="code" label="Code" rules={[{ required: true, message: "Please enter code" }]}>
          <Input placeholder="Enter code" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter description" }]}>
          <Input placeholder="Enter description" />
        </Form.Item>
        <Form.Item name="subdescription" label="Sub Description">
          <Input placeholder="Enter sub description" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Code
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCodeModal;
