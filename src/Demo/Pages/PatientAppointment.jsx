import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal } from "antd";
import { fetchAppointmentsByPatientId, updatePatientAppointment } from "../Redux/Slices/PatientRegisterSlice";
import PatientAppointmentCard from "./PatientAppointmentCard";

const PatientAppointment = () => {
  const dispatch = useDispatch();
  const patientId = JSON.parse(localStorage.getItem("patient-user"))?.id;
  const {  appointments } = useSelector((state) => state.patientRegister);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (patientId) {
      dispatch(fetchAppointmentsByPatientId(patientId));
    }
  }, [dispatch, patientId]);

  const columns = [
    {
      title: "Doctor Name",
      dataIndex: ["preferred_doctor", "name"],
      key: "doctorName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Final Time",
      dataIndex: "final_time",
      key: "finaltime",
      render: (text) => (text ? new Date(text).toLocaleString() : "Not Assigned"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedAppointment(record);
            setIsModalVisible(true);
          }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Patient Upcoming Appointments</h2>
      <Table
        dataSource={appointments || []}
        columns={columns}
        rowKey="id"
        pagination={10}
      />

      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedAppointment(null);
        }}
      >
        {selectedAppointment && (
          <PatientAppointmentCard appointment={selectedAppointment} />
        )}
      </Modal>
    </div>
  );
};

export default PatientAppointment;
