import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message, Space, Typography, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addCode, fetchCodes, fetchBooks, reviewCode } from "../Redux/Slices/codeSlice";

const { Text } = Typography;
const { Option } = Select;

const AddCodeModal = ({ open, onClose, loggedInUserId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  // Get books and codes from Redux state (moved to top level)
  const { books, codes } = useSelector((state) => state.codes); 
  
  useEffect(() => {
    dispatch(fetchBooks()); // Fetch books when the modal opens
    dispatch(fetchCodes());
  }, [dispatch]);

  const onFinish = async (values) => {

    //console.log(books); // Check if books are properly loaded

    const formattedData = {
      book: parseInt(values.book, 10),
      code: values.code,
      description: values.description,
      //updated_by: { id: user.id, username: user.username },
       user_id: loggedInUserId,
       updated_by: user?.username, // Username
      sub_descriptions: values.sub_descriptions.map((item, index) => ({
        code: item.code || `sub_${index + 1}`,
        sub_description: item.sub_description.trim(),
      })),
    };

    // Check if the entered Code or Sub-Description Code already exists
    const existingCode = Array.isArray(codes) ? codes.find(c => c.code === formattedData.code) : null;
    const existingSubCode = Array.isArray(codes) ? codes.find(c =>
      c.sub_descriptions?.some(sub => sub.code === formattedData.sub_descriptions[0]?.code)
    ) : null;

    if (existingCode || existingSubCode) {
      message.info("This code already exists. Reviewing instead.");
      dispatch(reviewCode({ id: existingCode?.id || existingSubCode?.id, status: "pending" }));
      return;
    }

    try {
      const response = await dispatch(addCode(formattedData)).unwrap();
      message.success(response?.message || "Code added successfully!");
      dispatch(fetchCodes());
      dispatch(fetchBooks());
      form.resetFields();
      onClose();
    } catch (error) {
      //console.error("Error adding code:", error);
      message.error(error?.message || "Failed to add code!");
    }
  };

  return (
    <Modal title="Add New Code" open={open} onCancel={onClose} footer={null}>
      <Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ sub_descriptions: [{ code: "", sub_description: "" }] }}>
        <Form.Item label="Book" name="book" rules={[{ required: true, message: "Please select a book!" }]}>
          <Select placeholder="Select a book" optionLabelProp="label">
            {Array.isArray(books) && books.length > 0 ? (
              books.map((book) => (
                <Option key={book.id} value={book.id} label={book.name}>
                  {book.name} {/* Displaying book name */}
                </Option>
              ))
            ) : (
              <Option disabled>No books available</Option> // Fallback option if no books are available
            )}
          </Select>
        </Form.Item>
        <Form.Item label="Code" name="code" rules={[{ required: true, message: "Please input the code!" }]}>
          <Input placeholder="Enter code" />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please input the description!" }]}>
          <Input placeholder="Enter description" />
        </Form.Item>

        {/* Sub-Descriptions Section with Label */}
        <Text strong>Sub-Descriptions</Text> {/* Label for Sub-Descriptions */}
        <Form.List name="sub_descriptions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, "code"]}
                    rules={[{ required: true, message: "Please input the sub-description code!" }]}
                  >
                    <Input placeholder="Sub-Description Code" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "sub_description"]}
                    rules={[{ required: true, message: "Please input the sub-description!" }]}
                  >
                    <Input placeholder="Sub-Description" />
                  </Form.Item>
                  {index > 0 && <MinusCircleOutlined onClick={() => remove(name)} style={{color: "red", fontSize: 20}}/>}
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Sub-Description
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

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
