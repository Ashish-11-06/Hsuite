import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAppointmentsByDoctorId, updateAppointmentDoctorStatus } from "../Redux/Slices/PatientRegisterSlice";
import { Table, Button, Tag, Spin, message, Modal, Select, Input, DatePicker } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const Appointments = () => {
    const dispatch = useDispatch();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [status, setStatus] = useState("");
    const [remark, setRemark] = useState("");
    const [finalTime, setFinalTime] = useState(null);

    const user = JSON.parse(localStorage.getItem("HMS-user"));
    const doctorId = user?.id;

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const response = await dispatch(fetchAppointmentsByDoctorId(doctorId)).unwrap();
            setAppointments(response.appointments || []);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch appointments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (doctorId) loadAppointments();
    }, [doctorId]);

    const showStatusModal = (id) => {
        setSelectedAppointmentId(id);
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        if (!status) {
            message.warning("Please select a status");
            return;
        }

        if ((status === "accepted" || status === "rescheduled") && !finalTime) {
            message.warning("Please select a final time");
            return;
        }

        const data = {
            status,
            status_remark: remark,
        };

        if (status === "accepted" || status === "rescheduled") {
            data.final_time = dayjs(finalTime).toISOString();
        }

        try {
            await dispatch(updateAppointmentDoctorStatus({
                appointmentId: selectedAppointmentId,
                data,
            })).unwrap();
            await loadAppointments(); // Refresh data
        } catch (err) {
            console.error(err);
            message.error("Failed to update appointment");
        }

        setIsModalVisible(false);
        setStatus("");
        setRemark("");
        setFinalTime(null);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setStatus("");
        setRemark("");
        setFinalTime(null);
    };

    const columns = [
        {
            title: "Patient Name",
            dataIndex: ["patient", "full_name"],
            key: "patient_name",
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
        },
        {
            title: "Reason",
            dataIndex: "reason",
            key: "reason",
        },
        {
            title: "Preferred Time",
            dataIndex: "preferred_date_and_time",
            key: "preferred_time",
            render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "Final Time",
            dataIndex: "final_time",
            key: "final_time",
            render: (text) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "—"),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
        },
        {
            title: "Status Remark",
            dataIndex: "status_remark",
            key: "status_remark",
            render: (text) => text || "—",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => showStatusModal(record.id)}
                    disabled={["accepted", "rescheduled", "rejected", "cancelled"].includes(record.status)}
                >
                    Update Status
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <h2>Doctor Appointments</h2>

            {loading ? (
                <Spin />
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <Table
                    dataSource={appointments}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            )}

            <Modal
                title="Update Appointment Status"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <label>Status</label>
                <Select
                    placeholder="Select status"
                    style={{ width: "100%", marginBottom: 10 }}
                    onChange={(value) => setStatus(value)}
                    value={status}
                >
                    <Option value="accepted">Accepted</Option>
                    <Option value="rejected">Rejected</Option>
                    <Option value="rescheduled">Rescheduled</Option>
                </Select>

                {(status === "accepted" || status === "rescheduled") && (
                    <>
                        <label>Final Time</label>
                        <DatePicker
                            showTime
                            style={{ width: "100%", marginBottom: 10 }}
                            value={finalTime}
                            onChange={(value) => setFinalTime(value)}
                            format="YYYY-MM-DD HH:mm"
                        />
                    </>
                )}

                <label>Status Remark</label>
                <Input.TextArea
                    rows={3}
                    placeholder="Enter remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                />
            </Modal>
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case "accepted":
            return "green";
        case "rejected":
            return "red";
        case "rescheduled":
            return "orange";
        default:
            return "blue";
    }
};

export default Appointments;
