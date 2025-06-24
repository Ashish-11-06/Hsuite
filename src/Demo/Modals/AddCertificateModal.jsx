import React from "react";
import { useState } from "react";
import { Modal, Form, DatePicker, Input, message, Descriptions, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { PostCertificate, GetCertificates } from "../Redux/Slices/PatientHistorySlice";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";

const {TextArea} = Input;

const AddCertificateModal = ({ open, onClose, patientId, onCertificateAdded }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(false);

  const {users} = useSelector((state) => state.users);
  const doctorOptions = users?.filter((user) => user.designation === "doctor");

  const handleSubmit = async () => {
   try {
    const values = await form.validateFields();
    if (!doctorId) {
      return message.warning("Please select a doctor");
    }
    // setLoading(true);
    const payload={
        patient : patientId,
        added_by: doctorId,
        description: values.description,
        remark: values.remark,
    };
    await dispatch(PostCertificate(payload)).unwrap();
    if (onCertificateAdded) {
      onCertificateAdded();
    }
    onClose();
    form.resetFields();
    setDoctorId(null);
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal
      title="Add Medical Certificate"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Submit"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <TextArea rows={4} placeholder="e.g. Patient is advised rest..." />
        </Form.Item>
        <Form.Item
          label="Remark"
          name="remark"
          rules={[{ required: true, message: "Please enter the remark" }]}
        >
          <Input placeholder="e.g. Needs follow-up after recovery" />
        </Form.Item>

         <Form.Item label="Select Doctor" required>
          <Select
            placeholder="Select a doctor"
            value={doctorId}
            onChange={(value) => setDoctorId(value)}
            showSearch
            optionFilterProp="children"
          >
            {doctorOptions?.map((doctor) => (
              <Option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCertificateModal;