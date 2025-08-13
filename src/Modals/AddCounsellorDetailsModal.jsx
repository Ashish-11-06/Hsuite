import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Input, InputNumber, Button, message, Upload, Avatar } from "antd";
import { CompleteCounsellorProfile } from "../Redux/Slices/authSlice";
import { UserOutlined, LoadingOutlined } from "@ant-design/icons";

const AddCounsellorDetailsModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const userId = useSelector((state) => state.auth.userId);

  const authState = useSelector((state) => state.auth);
  // console.log("auth state:", authState);


  const handleImageChange = (info) => {
    // console.log("Upload info received:", info);

    if (info.file.status === 'removed') {
      // console.log("Image removed");
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }

    // Access originFileObj from fileList
    const fileList = info.fileList;
    if (!fileList || fileList.length === 0) {
      console.warn("No files in fileList");
      return;
    }

    const latestFile = fileList[fileList.length - 1].originFileObj;
    // console.log("Latest selected file object:", latestFile);

    if (!latestFile) {
      console.error("No originFileObj found in fileList");
      return;
    }

    if (!latestFile.type.startsWith("image/")) {
      console.error("Invalid file type:", latestFile.type);
      message.error("Only image files are allowed!");
      return;
    }

    if (latestFile.size > 5 * 1024 * 1024) {
      console.error("File too large:", latestFile.size);
      message.error("Image must be smaller than 5MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      // console.log("Preview base64:", e.target.result.slice(0, 100));
      setPreviewUrl(e.target.result);
      setImageFile(latestFile);
      message.success("Image uploaded successfully!");
    };

    reader.onerror = (err) => {
      console.error("Error reading file:", err);
      message.error("Failed to load image preview.");
    };

    reader.readAsDataURL(latestFile);
  };



  const handleSubmit = async (values) => {
    if (!imageFile) {
      message.error("Please upload a profile photo");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("photo", imageFile);
    formData.append("user_id", userId);
    formData.append("first_name", values.first_name);
    formData.append("middle_name", values.middle_name || "");
    formData.append("last_name", values.last_name);
    formData.append("educational_qualifications", values.educational_qualifications);
    formData.append("years_of_experience_months", values.years_of_experience_months);
    formData.append("current_post", values.current_post);

    try {
      await dispatch(CompleteCounsellorProfile(formData)).unwrap();
      message.success("Profile updated successfully!");
      form.resetFields();
      setImageFile(null);
      setPreviewUrl(null);
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      message.error(error.message || "Failed to update profile");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Complete Your Counsellor Profile"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
      maskClosable={false}     // ✅ Prevent close on outside click
      keyboard={false}
      closable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Upload
            name="avatar"
            listType="picture-circle"
            showUploadList={false}
            beforeUpload={() => false} // Prevent auto upload
            onChange={handleImageChange}
            accept="image/*"
          >
            {previewUrl ? (
              <Avatar
                src={previewUrl}
                size={100}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <div>
                <Avatar
                  icon={<UserOutlined />}
                  size={90}
                  style={{ cursor: 'pointer' }}
                />
                {/* <div style={{ marginTop: 8 }}>Upload Photo</div> */}
              </div>
            )}
          </Upload>
        </div>

        {/* Rest of your form fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Middle Name"
            name="middle_name"
          >
            <Input placeholder="(Optional)" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item
          label="Educational Qualifications"
          name="educational_qualifications"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={1} />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Years of Experience (months)"
            name="years_of_experience_months"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Current Position"
            name="current_post"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={uploading}
          >
            {uploading ? 'Saving...' : 'Save Profile'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCounsellorDetailsModal;