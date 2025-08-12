import React, { useState } from "react";
import { Modal, Input, TimePicker, Form, message } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { addDoctorTimeTable, getDoctorTimeTable } from "../Redux/Slices/PatientRegisterSlice";

const AddNewTimeTableModal = ({ open, onCancel, day, date, time }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const payload = {
        doctor: JSON.parse(localStorage.getItem("HMS-user"))?.id,
        day,
        date,
        start_time: dayjs(values.start_time).format("HH:mm:ss"),
        end_time: dayjs(values.end_time).format("HH:mm:ss"),
        remark: values.remark,
      };

      dispatch(addDoctorTimeTable(payload)).then(res => {
        if (res?.type?.includes("fulfilled")) {
            dispatch(getDoctorTimeTable(payload.doctor));
        //   message.success("Time slot added");
          onCancel();
          
        } else {
          message.error("Failed to add time slot");
        }
      });
    });
  };

  return (
    <Modal
      title="Add Doctor Time Slot"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Save"
    >
      <p><strong>Day:</strong> {day}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Slot Time:</strong> {time}</p>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Start Time"
          name="start_time"
          rules={[{ required: true, message: "Please select start time" }]}
        >
          <TimePicker format="hh:mm A" use12Hours />
        </Form.Item>
        <Form.Item
          label="End Time"
          name="end_time"
          rules={[{ required: true, message: "Please select end time" }]}
        >
          <TimePicker format="hh:mm A" use12Hours />
        </Form.Item>
        <Form.Item
          label="Remark"
          name="remark"
          rules={[{ required: true, message: "Please enter remark" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewTimeTableModal;
