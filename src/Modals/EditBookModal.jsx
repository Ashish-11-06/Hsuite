import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editBook } from "../Redux/Slices/bookSlice";

const EditBookModal = ({ open, onClose, book, loggedInUserId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (book) {
      form.setFieldsValue(book); // Set form values
    }
  }, [book, form]);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      await dispatch(editBook({ id: book.id, 
         bookData: values,
         user_id: loggedInUserId,
         created_by: user?.username,
        })).unwrap();
      message.success("Book updated successfully!");
      onClose();
    } catch (error) {
      message.error("Failed to update book");
    }
  };

  return (
    <Modal title="Edit Book" open={open} onCancel={onClose} footer={null}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" label="Book Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="version" label="Version" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        {/* <Form.Item name="first_publish_year" label="First Published Year" rules={[{ required: true }]}>
          <Input />
        </Form.Item> */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBookModal;
