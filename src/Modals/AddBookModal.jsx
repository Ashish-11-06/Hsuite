import React, {useState} from "react";
import { Modal, Form, Input, Button, message, Space, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addBook } from "../Redux/Slices/bookSlice";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const AddBookModal = ({ open, onClose, loggedInUserId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch(); // ✅ Use Redux dispatch
  const user = useSelector((state) => state.auth.user);
  const [code_sets, setCodeSets] = useState([{ name: "" }]); // Initialize as objects

  // Function to handle form submission
  const handleSubmit = async (values) => {
    try {
      await dispatch(addBook({...values, 
        code_sets,
         user_id: loggedInUserId,  
         created_by: user?.id, // Username
        // created_by: { id: user.id, username: user.username },
      })).unwrap(); // ✅ Dispatch addBook action
      message.success("Book added successfully!");
      form.resetFields(); // Reset form fields
      setCodeSets([{name: ""}]); // Reset codeSets fields after submission
      onClose(); // Close the modal
    } catch (error) {
      message.error("Failed to add book");
    }
  };

 
// Function to add a new code set field
const addCodeSet = () => {
  setCodeSets([...code_sets, { name: ""}]); // Maintain object structure
};

// Function to update a code set field
const updateCodeSet = (index, value) => {
  const newCodeSets = [...code_sets];
  newCodeSets[index].name = value;
  setCodeSets(newCodeSets);
};

// Function to remove a specific code set field
const removeCodeSet = (index) => {
  setCodeSets(code_sets.filter((_, i) => i !== index));
};


  return (
    <Modal
      title="Add New Book"
      open={open}
      onCancel={onClose}
      footer={null} // Remove default footer buttons
      styles={{ body: { maxHeight: "60vh", overflowY: "auto" } }}
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

         {/* Author Name */}
         <Form.Item name="author" label="Author" rules={[{ required: true, message: "Please enter the author's name" }]}>
          <Input placeholder="Enter author name" />
        </Form.Item>

       {/* Code Sets Section - Matching AddCodeModal Styling */}
       <Text strong>Code Sets</Text>
        <Form.Item>
          {code_sets.map((set, index) => (
            <Space key={index} style={{ display: "flex", marginBottom: 8, width: "100%" }} align="baseline">
              <Input
                placeholder="Enter Code Set"
                value={code_sets[index].name}
                onChange={(e) => updateCodeSet(index, e.target.value)}
                // onChange={(e) => {
                //   const newCodeSets = [...codeSets];
                //   newCodeSets[index].code = e.target.value;
                //   setCodeSets(newCodeSets);
                // }}
                style={{ width: "100%" }} // Ensuring consistent width
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
