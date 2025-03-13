import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addBook } from "../Redux/Slices/bookSlice";

const AddBookModal = ({ open, onClose, loggedInUserId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch(); // ✅ Use Redux dispatch
  const user = useSelector((state) => state.auth.user);

  // Function to handle form submission
  const handleSubmit = async (values) => {
    try {
      await dispatch(addBook({...values, 
         user_id: loggedInUserId,  
         created_by: user?.username, // Username
        //created_by: { id: user.id, username: user.username },
      })).unwrap(); // ✅ Dispatch addBook action
      message.success("Book added successfully!");
      form.resetFields(); // Reset form fields
      onClose(); // Close the modal
    } catch (error) {
      message.error("Failed to add book");
    }
  };

  return (
    <Modal
      title="Add New Book"
      open={open}
      onCancel={onClose}
      footer={null} // Remove default footer buttons
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {/* Book Name */}
        <Form.Item
          name="name"
          label="Book Name"
          rules={[{ required: true, message: "Please enter the book name" }]}
        >
          <Input placeholder="Enter book name" />
        </Form.Item>

        {/* Book Version */}
        <Form.Item
          name="version"
          label="Version"
          rules={[{ required: true, message: "Please enter the version" }]}
        >
          <Input placeholder="Enter version" />
        </Form.Item>

        {/* First Published Year */}
        {/* <Form.Item
          name="first_publish_year"
          label="First Published Year"
          rules={[{ required: true, message: "Please enter the year" }]}
        >
          <Input placeholder="Enter year" />
        </Form.Item> */}

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Book
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddBookModal;
