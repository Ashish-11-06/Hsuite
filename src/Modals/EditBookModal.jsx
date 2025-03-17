import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, message, Space, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editBook } from "../Redux/Slices/bookSlice";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const EditBookModal = ({ open, onClose, book, loggedInUserId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [codeSets, setCodeSets] = useState([]);

  useEffect(() => {
    if (book) {
      form.setFieldsValue(book); // Set form values
      setCodeSets(book.codeSets || [{ code: "" }]);
    }
  }, [book, form]);

   // Function to update a specific code set
   const updateCodeSet = (index, value) => {
    const newCodeSets = [...codeSets];
    newCodeSets[index].code = value;
    setCodeSets(newCodeSets);
  };

  // Function to add a new code set field
  const addCodeSet = () => {
    setCodeSets([...codeSets, { code: "" }]);
  };

  // Function to remove a specific code set field
  const removeCodeSet = (index) => {
    setCodeSets(codeSets.filter((_, i) => i !== index));
  };


  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      await dispatch(editBook({ id: book.id, 
         bookData: {...values, codeSets},
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
          {codeSets.map((set, index) => (
            <Space key={index} style={{ display: "flex", marginBottom: 8, width: "100%" }} align="baseline">
              <Input
                placeholder="Enter Code Set"
                value={set.code}
                onChange={(e) => updateCodeSet(index, e.target.value)}
                style={{ width: "100%" }}
              />
              {codeSets.length > 1 && (
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
    </Modal>
  );
};

export default EditBookModal;
