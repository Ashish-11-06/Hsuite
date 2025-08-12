import React, { useState } from "react";
import { Modal, TimePicker, Input, Button, message } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { getDoctorTimeTable, updateDoctorTimeTable } from "../Redux/Slices/PatientRegisterSlice";

const UpdateTimeTableModal = ({ open, timetableId, onClose, date, start, end, remark, doctorId }) => {
  const dispatch = useDispatch();
  const [startTime, setStartTime] = useState(dayjs(start, "HH:mm:ss"));
  const [endTime, setEndTime] = useState(dayjs(end, "HH:mm:ss"));
  const [updatedRemark, setUpdatedRemark] = useState(remark);

  const handleUpdate = () => {
    if (!startTime || !endTime) return message.warning("Start and End time required");

    const body = {
      start_time: startTime.format("HH:mm:ss"),
      end_time: endTime.format("HH:mm:ss"),
      remark: updatedRemark || "",
    };

    dispatch(updateDoctorTimeTable({ timetableId, data: body })).then((res) => {
      if (res.type.includes("fulfilled")) {
        dispatch(getDoctorTimeTable(doctorId));
        // message.success("Slot updated");
        onClose();
      } else {
        message.error("Failed to update slot");
      }
    });
  };

  return (
    <Modal
      open={open}
      title={`Update Slot - ${date}`}
      onCancel={onClose}
      footer={[
        <Button onClick={onClose}>Cancel</Button>,
        <Button type="primary" onClick={handleUpdate}>
          Update
        </Button>,
      ]}
    >
      <div style={{ marginBottom: "16px" }}>
        <strong>Start Time:</strong>
        <TimePicker
          format="hh:mm A"
          value={startTime}
          onChange={(val) => setStartTime(val)}
          use12Hours
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <strong>End Time:</strong>
        <TimePicker
          format="hh:mm A"
          value={endTime}
          onChange={(val) => setEndTime(val)}
          use12Hours
          style={{ width: "100%" }}
        />
      </div>
      <div>
        <strong>Remark:</strong>
        <Input.TextArea
          value={updatedRemark}
          onChange={(e) => setUpdatedRemark(e.target.value)}
          placeholder="Optional remark"
        />
      </div>
    </Modal>
  );
};

export default UpdateTimeTableModal;
