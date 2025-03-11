import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Space, message } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { editCode, fetchCodes } from "../Redux/Slices/codeSlice"; // Import Redux action

const EditReviewModal = ({ open, onClose, code }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [subDescriptions, setSubDescriptions] = useState([]);
  const [codeValue, setCodeValue] = useState("");

  useEffect(() => {
    if (code) {
      setCodeValue(code.code || "");
      setDescription(code.description || "");
      setSubDescriptions(code.sub_descriptions ? [...code.sub_descriptions] : []);
    }
  }, [code]);

  const handleSubDescriptionChange = (index, field, value) => {
    const updatedSubDescriptions = [...subDescriptions];
    updatedSubDescriptions[index] = {
      ...updatedSubDescriptions[index],
      [field]: value,
    };
    setSubDescriptions(updatedSubDescriptions);
  };

  const handleAddSubDescription = () => {
    setSubDescriptions([...subDescriptions, { code: "", sub_description: "" }]);
  };

  const handleRemoveSubDescription = (index) => {
    setSubDescriptions(subDescriptions.filter((_, i) => i !== index));
  };

  const onFinish = () => {
    const updatedData = {
      id: code?.id,
      code: codeValue,
      description,
      sub_descriptions: subDescriptions,
    };

    dispatch(editCode(updatedData))
      .unwrap()
      .then((response) => {
        message.success("Edit review submitted successfully!");
        dispatch(fetchCodes()); // Refresh the codes list
        onClose(response); // Pass the updated data back to ReviewCodeModal
      })
      .catch((error) => {
        message.error("Failed to submit edit review");
      });
  };

  return (
    <Modal title="Edit Review" open={open} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Code">
          <Input value={codeValue} onChange={(e) => setCodeValue(e.target.value)} placeholder="Enter code" />
        </Form.Item>

        <Form.Item label="Description">
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />
        </Form.Item>

        <label><strong>Sub-Descriptions</strong></label>
        {subDescriptions.map((sub, index) => (
          <Space key={index} style={{ display: "flex", marginBottom: 8 }} align="baseline">
            <Input
              placeholder="Enter code"
              value={sub.code}
              onChange={(e) => handleSubDescriptionChange(index, "code", e.target.value)}
            />
            <Input
              placeholder="Enter sub-description"
              value={sub.sub_description}
              onChange={(e) => handleSubDescriptionChange(index, "sub_description", e.target.value)}
            />
            <MinusCircleOutlined style={{ color: "red", fontSize: 20 }} onClick={() => handleRemoveSubDescription(index)} />
          </Space>
        ))}

        <Button 
          type="dashed" 
          onClick={handleAddSubDescription} 
          style={{ marginTop: 10, width: '100%' }} // Set width to 100%
        >
          + Add Sub-Description
        </Button>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <Button type="primary" htmlType="submit">Submit</Button>
          <Button onClick={() => onClose(code)}>Skip</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditReviewModal;