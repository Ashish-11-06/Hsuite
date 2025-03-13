import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";

const EditCodeModal = ({ open, onClose, code, onEdit, loggedInUserId }) => {
    const [form] = Form.useForm();
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

    // Handle input changes
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    
    const handleSubDescriptionChange = (index, field, value) => {
        const updatedSubDescriptions = [...subDescriptions];
        updatedSubDescriptions[index] = {
            ...updatedSubDescriptions[index],
            [field]: value
        };
        setSubDescriptions(updatedSubDescriptions);
    };

    const handleAddSubDescription = () => {
        setSubDescriptions([...subDescriptions, { code: "", sub_description: "" }]);
    };

    const handleRemoveSubDescription = (index) => {
        setSubDescriptions((prevSubDescriptions) =>
            prevSubDescriptions.filter((_, i) => i !== index)
        );
    };

    const onFinish = () => {
        const updatedData = {
            id: code?.id,
            code: codeValue,
            description,
            user_id: loggedInUserId,
            sub_descriptions: [...subDescriptions],
        };
        onEdit(updatedData);
        onClose();
    };

    return ( 
        <Modal title="Edit Code" open={open} onCancel={onClose} footer={null}>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Code">
                    <Input value={codeValue}  onChange={(e) => setCodeValue(e.target.value)}// Allow editing
                         placeholder="Enter code" />
                </Form.Item>

                <Form.Item label="Description">
                    <Input value={description} onChange={handleDescriptionChange} placeholder="Enter description" />
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
                        
                        <div onClick={() => handleRemoveSubDescription(index)}><MinusCircleOutlined style={{color: "red", fontSize: 20}}/></div>
                    </Space>
                ))}
                
                <Button type="dashed" onClick={handleAddSubDescription} style={{ marginTop: 10 }}>+ Add Sub-Description</Button>

                <Form.Item style={{ marginTop: 20 }}>
                    <Button type="primary" htmlType="submit">Update Code</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditCodeModal;
