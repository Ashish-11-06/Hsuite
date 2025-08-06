// Modals/PatientBookAppointmentModal.jsx

import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  message,
  Spin,
} from "antd";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import {
  postPatientAppointment,
  fetchAppointmentsByDoctorId,
} from "../Redux/Slices/PatientRegisterSlice";

const timeSlots = {
  Morning: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
  Afternoon: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
  Evening: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"],
};

const formatTime12Hour = (time24) => {
  const [hour, minute] = time24.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const PatientBookAppointmentModal = ({ visible, onClose, doctor, department }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("patient-user"));

  useEffect(() => {
    if (visible && doctor?.id) {
      setLoading(true);
      dispatch(fetchAppointmentsByDoctorId(doctor.id))
        .unwrap()
        .then((res) => {
          setBookedSlots(res.appointments.map((a) => dayjs(a.preferred_date_and_time)));
        })
        .catch(() => message.error("Failed to fetch booked slots"))
        .finally(() => setLoading(false));
    }
  }, [visible, doctor, dispatch]);

  const handleSubmit = (values) => {
    if (!selectedDate || !selectedTime || !department) {
      return message.error("Please complete all fields.");
    }

    const datetime = dayjs(`${selectedDate} ${selectedTime}`).toISOString();

    const payload = {
      department,
      preferred_doctor: doctor.id,
      reason: values.reason,
      preferred_date_and_time: datetime,
      patient_status: "available",
      patient_id: user?.id,
    };

    setBookingLoading(true);
    dispatch(postPatientAppointment(payload))
      .unwrap()
      .then(() => {
        // message.success("Appointment booked!");
        form.resetFields();
        setSelectedDate(null);
        setSelectedPeriod(null);
        setSelectedTime(null);
        onClose();
      })
      .catch(() => message.error("Failed to book appointment"))
      .finally(() => setBookingLoading(false));
  };

  return (
    <Modal
      title={`Book Appointment with Dr. ${doctor?.name}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={550}
    >
      {loading ? (
        <Spin />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="reason"
            label="Reason for Visit"
            rules={[{ required: true, message: "Please enter a reason" }]}
          >
            <Input.TextArea rows={3} placeholder="Describe your concern..." />
          </Form.Item>

          <DatePicker
            onChange={(date) =>
              setSelectedDate(date?.format("YYYY-MM-DD")) || setSelectedTime(null)
            }
            disabledDate={(current) => current && current < dayjs().startOf("day")}
            style={{ width: "100%", marginBottom: 12 }}
          />

          <Radio.Group
            onChange={(e) => setSelectedPeriod(e.target.value)}
            value={selectedPeriod}
            style={{
              marginBottom: 12,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <Radio.Button value="Morning">🌅 Morning</Radio.Button>
            <Radio.Button value="Afternoon">🌞 Afternoon</Radio.Button>
            <Radio.Button value="Evening">🌙 Evening</Radio.Button>
          </Radio.Group>

          {selectedPeriod && selectedDate && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              {timeSlots[selectedPeriod].map((time) => {
                const isoDateTime = dayjs(`${selectedDate} ${time}`).toISOString();

                const isBooked = bookedSlots.some((appt) =>
                  dayjs(appt).isSame(isoDateTime)
                );

                return (
                  <Button
                    key={time}
                    type={selectedTime === time ? "primary" : "default"}
                    onClick={() => setSelectedTime(time)}
                    shape="round"
                    disabled={isBooked}
                  >
                    {formatTime12Hour(time)}
                  </Button>
                );
              })}
            </div>
          )}

          {selectedTime && (
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={bookingLoading}
                block
              >
                Confirm Appointment
              </Button>
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
};

export default PatientBookAppointmentModal;
