import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, DatePicker, Select, message } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { postDeathReport } from "../Redux/Slices/ReportSlice";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";

const { Option } = Select;

const AddDeathReportModal = ({ visible, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch patients on mount
  useEffect(() => {
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await dispatch(fetchAllPatients()).unwrap();
      const patientList = Array.isArray(res) ? res : res?.patients || []; // Adjust based on actual API
      setPatients(patientList);
    } catch (error) {
      message.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };
  fetchPatients();
}, [dispatch]);


  const handleSubmit = async (values) => {
    const payload = {
      patient: values.patient,
      date_of_death: values.date_of_death.format("YYYY-MM-DD"),
      gender: values.gender,
      cause_of_death: values.cause_of_death,
      remark: values.remark,
      created_by: parseInt(localStorage.getItem("HMS-user"))?.id,
    };

    try {
      await dispatch(postDeathReport(payload)).unwrap();
    //   message.success("Death report submitted successfully");
      form.resetFields();
      onSuccess && onSuccess();
      onCancel();
    } catch (error) {
      message.error("Failed to submit death report");
    }
  };

  return (
    <Modal
      open={visible}
      title="Add Death Report"
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="patient"
          label="Patient"
          rules={[{ required: true, message: "Please select a patient" }]}
        >
          <Select placeholder="Select patient" loading={loading}>
            {patients.map((p) => (
              <Option key={p.id} value={p.id}>
                {p.full_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="date_of_death"
          label="Date of Death"
          rules={[{ required: true, message: "Please select the date of death" }]}
        >
          <DatePicker style={{ width: "100%" }} disabledDate={d => d.isAfter(dayjs())} />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please enter gender" }]}
        >
          <Select placeholder="Select gender">
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="cause_of_death"
          label="Cause of Death"
          rules={[{ required: true, message: "Please enter cause of death" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="remark"
          label="Remark"
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDeathReportModal;
