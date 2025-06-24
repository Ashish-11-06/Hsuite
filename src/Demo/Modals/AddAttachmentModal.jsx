import React, { useState } from "react";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { PostAttachment } from "../Redux/Slices/PatientHistorySlice";

const { TextArea } = Input;

const AddAttachmentModal = ({ open, onClose, patientId, onAttachmentUploaded }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList.slice(-1)); // keep only latest file
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (fileList.length === 0) {
        return message.warning("Please upload a file");
      }

      const rawFile = fileList[0]?.originFileObj;
      if (!(rawFile instanceof File)) {
        return message.error("Invalid file");
      }

      const formData = new FormData();
      formData.append("patient", patientId);
      formData.append("attachment_name", values.attachment_name);
      formData.append("description", values.description);
      formData.append("file", rawFile); // ✅ only file

      // Optional: Debug actual form data
      for (let [key, val] of formData.entries()) {
        if (key === "file") {
          console.log("Sending file:", val.name);
        } else {
          console.log(`${key}:`, val);
        }
      }

      setLoading(true);
      await dispatch(PostAttachment(formData)).unwrap();

      message.success("Attachment uploaded successfully");
      form.resetFields();
      setFileList([]);
      onClose();
      if (onAttachmentUploaded) onAttachmentUploaded();
    } catch (err) {
      console.error("Upload failed:", err);
      message.error("Failed to upload attachment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Attachment"
      open={open}
      onCancel={() => {
        form.resetFields();
        setFileList([]);
        onClose();
      }}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Upload"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Attachment Name"
          name="attachment_name"
          rules={[{ required: true, message: "Please enter attachment name" }]}
        >
          <Input placeholder="e.g. X-ray Report" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea placeholder="e.g. Report of the chest x-ray" rows={3} />
        </Form.Item>

        <Form.Item label="Upload File" required>
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleFileChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAttachmentModal;
