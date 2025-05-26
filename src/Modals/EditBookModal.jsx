import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, message, Space, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editBook, fetchBooks } from "../Redux/Slices/bookSlice";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const EditBookModal = ({ open, onClose, book, loggedInUserId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [code_sets, setCodeSets] = useState([]);

  useEffect(() => {
    if (book) {
      form.setFieldsValue(book); // Set form values
      setCodeSets(book.code_sets || [{ name: "" }]);
    }
  }, [book, form]);

  const updateCodeSet = (index, value) => {
    setCodeSets((prevCodeSets) => 
      prevCodeSets.map((set, i) => 
        i === index ? { ...set, name: value } : set
      )
    );
  };

  // Function to add a new code set field
  const addCodeSet = () => {
    setCodeSets([...code_sets, { name: "" }]);
  };

  // Function to remove a specific code set field
  const removeCodeSet = (index) => {
    setCodeSets(code_sets.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values) => {
    try {
      const response = await dispatch(
        editBook({ 
          id: book.id, 
          bookData: { ...values, code_sets },
          user_id: loggedInUserId,
          created_by: user?.username,
        })
      ).unwrap(); // ✅ Ensure we get a valid response
  
      if (response) {
        message.success("Book updated successfully!"); // ✅ Success Message
        form.resetFields(); // ✅ Clear form fields
        onClose(); // ✅ Close modal
        dispatch(fetchBooks()); // ✅ Refresh list
      } else {
        throw new Error("No response from server"); // ❌ Handle unexpected response
      }
    } catch (error) {
      //console.error("Edit Book Error:", error);
      message.error("Failed to update book"); // ❌ Error Message
    }
  };

  return (
    <Modal title="Edit Book" open={open} onCancel={onClose} 
    footer={null}
    styles={{ body: { maxHeight: "60vh", overflowY: "auto" } }}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" label="Book Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
           {/* Author Name */}
           <Form.Item name="author" label="Author" rules={[{ required: true, message: "Please enter the author's name" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="version" label="Version" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        {/* <Form.Item name="first_publish_year" label="First Published Year" rules={[{ required: true }]}>
          <Input />
        </Form.Item> */}

         {/* Code Sets Section */}
         <Text strong>Code Sets</Text>
        <Form.Item>
          {code_sets.map((set, index) => (
            <Space key={index} style={{ display: "flex", marginBottom: 8, width: "100%" }} align="baseline">
              <Input
                placeholder="Enter Code Set"
                value={set.name}
                onChange={(e) => updateCodeSet(index, e.target.value)}
                style={{ width: "100%" }}
              />
              {code_sets.length > 1 && (
                <MinusCircleOutlined onClick={() => removeCodeSet(index)} style={{ color: "red", fontSize: 20 }} />
              )}
            </Space>
          ))}
          <Button type="dashed" onClick={addCodeSet} block icon={<PlusOutlined />} style={{ marginTop: 8, width: "100%" }}>
            Add Code Set
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
      </div>
    </Modal>
  );
};

export default EditBookModal;
