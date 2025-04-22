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
            setSubDescriptions(code.sub_descriptions ? code.sub_descriptions.map(sub => ({ 
                ...sub, 
                sub_data: sub.sub_data || "" 
              })) : []);
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
        setSubDescriptions([...subDescriptions, { code: "", sub_description: "", sub_data: "" }]);
    };

    const handleRemoveSubDescription = (index) => {
        const updated = subDescriptions.filter((_, i) => i !== index);
        setSubDescriptions(updated);
    };
      
    const onFinish = () => {
        const updatedData = {
            id: code?.id,
            code: codeValue,
            description,
            user_id: loggedInUserId,
            //sub_descriptions: [...subDescriptions],
            sub_descriptions: subDescriptions.filter(sub => sub.code.trim() !== "" && sub.sub_description.trim() !== "")
            .map(sub => ({
                ...sub,
                sub_data: sub.sub_data?.trim() || ""
            })), // Ensure removed items are excluded
        };
        onEdit(updatedData);
        onClose();
    };
    return ( 
        <Modal title="Edit Code" open={open} onCancel={onClose} footer={null} >
            <Form layout="vertical" onFinish={onFinish}  key={subDescriptions.length}>
                <Form.Item label="Code">
                    <Input value={codeValue}  onChange={(e) => setCodeValue(e.target.value)}// Allow editing
                         placeholder="Enter code" />
                </Form.Item>

                <Form.Item label="Description">
                    <Input value={description} onChange={handleDescriptionChange} placeholder="Enter description" />
                </Form.Item>
                 
                <label><strong>Sub-Descriptions</strong></label>
                {subDescriptions.map((sub, index) => (
                    <div>
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
                        
                        {subDescriptions.length > 1 && (
                            <MinusCircleOutlined
                                onClick={() => handleRemoveSubDescription(index)}
                                style={{ color: "red", fontSize: 20, cursor: "pointer" }}
                            />
                        )}
                    </Space>
                    <Input
                            placeholder="Notes (optional)"
                            value={sub.sub_data}
                            onChange={(e) => handleSubDescriptionChange(index, "sub_data", e.target.value)}
                            style={{ marginLeft: 8, width: 'calc(100% - 16px)' }}
                        />
                    </div>
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
