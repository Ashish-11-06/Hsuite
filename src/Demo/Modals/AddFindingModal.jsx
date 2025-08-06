import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, message } from "antd";
import { useDispatch } from "react-redux";
import { GetFinding, PostFinding } from "../Redux/Slices/PatientHistorySlice";

const AddFindingModal = ({ open, onClose, patientId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        patient: patientId,
        date: values.date.format("YYYY-MM-DD"),
      };
      dispatch(PostFinding(payload))
        .unwrap()
        .then((res) => {
          message.success(res?.message);
          form.resetFields();
          dispatch(GetFinding(patientId));
          onClose();
        })
        .catch((err) => {
          const errorMsg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to add finding";
          message.error(errorMsg);
        });
    });
  };

  return (
    <Modal
      title="Add New Finding"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Save"
      width={800}
      styles={{
        body: {
          maxHeight: "65vh",     // ensure this doesn't exceed the viewport
          overflowY: "auto",
          paddingRight: 12,
        },
        content: {
          overflow: "hidden",    // hides outer scroll
        },
      }}
    >
      <Form layout="vertical" form={form} >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true }]}
            style={{ flex: "1 1 48%" }}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="temperature" label="Temperature" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="pulse" label="Pulse" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="blood_pressure" label="Blood Pressure" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="weight" label="Weight" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="height" label="Height" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="cns" label="CNS" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="rs" label="RS" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="pa" label="PA" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="wbc" label="WBC" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>

          <Form.Item name="rbc" label="RBC" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
          <Form.Item
            name="note"
            label="Note"
            style={{ flex: "1 1 48%" }}
          >
            <Input.TextArea rows={3} placeholder="Enter any additional notes..." />
          </Form.Item>

        </div>
      </Form>
    </Modal>
  );
};

export default AddFindingModal;
