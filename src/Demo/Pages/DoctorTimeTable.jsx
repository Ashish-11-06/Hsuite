import React, { useEffect, useState } from "react";
import { Button, Spin, Modal, DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorTimeTable } from "../Redux/Slices/PatientRegisterSlice";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

import AddNewTimeTableModal from "../Modals/AddNewTimeTableModal";
import UpdateTimeTableModal from "../Modals/UpdateTimeTableModal";

const TIME_SLOTS = [
    "06:00 AM", "06:30 AM",
    "07:00 AM", "07:30 AM",
    "08:00 AM", "08:30 AM",
    "09:00 AM", "09:30 AM",
    "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM",
    "07:00 PM", "07:30 PM",
    "08:00 PM", "08:30 PM",
    "09:00 PM", "09:30 PM",
    "10:00 PM", "10:30 PM",
    "11:00 PM", "11:30 PM"
];

const DoctorTimeTable = () => {
    const dispatch = useDispatch();
    const doctor = JSON.parse(localStorage.getItem("HMS-user"));
    const doctorId = doctor?.id;

    const [showAddSlot, setShowAddSlot] = useState(false);
    const [slotInfo, setSlotInfo] = useState({ day: null, date: null, time: null });

    const [showUpdateSlot, setShowUpdateSlot] = useState(false);
    const [updateData, setUpdateData] = useState(null);


    const { loading, doctorTimetable } = useSelector((state) => state.patientRegister);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [modalVisible, setModalVisible] = useState(false);
    const [activeCell, setActiveCell] = useState(null);

    const daysInMonth = selectedDate.daysInMonth();
    const DAYS = Array.from({ length: daysInMonth }, (_, i) =>
        selectedDate.startOf("month").add(i, "day")
    );

    useEffect(() => {
        if (doctorId) {
            dispatch(getDoctorTimeTable(doctorId));
        }
    }, [dispatch, doctorId]);

    const getSlotStatus = (dayObj, timeLabel) => {
        const formattedDate = dayObj.format("YYYY-MM-DD");
        const slotDateTime = dayjs(`${formattedDate} ${dayjs(timeLabel, "hh:mm A").format("HH:mm:ss")}`);

        const matches = doctorTimetable?.filter((entry) => entry.date === formattedDate);
        if (!matches || matches.length === 0) return { status: "empty", remark: "" };

        for (const entry of matches) {
            const start = dayjs(`${entry.date} ${entry.start_time}`);
            const end = dayjs(`${entry.date} ${entry.end_time}`);

            // Inclusive start, exclusive end
            if (slotDateTime.isSame(start) || (slotDateTime.isAfter(start) && slotDateTime.isBefore(end))) {
                return { status: "booked", remark: entry.remark || "Booked" };
            }
        }
        return { status: "empty", remark: "" };
    };


    const cellStyle = (status) => ({
        border: "1px solid #d9d9d9",
        height: "45px",
        textAlign: "center",
        lineHeight: "45px",
        cursor: "pointer",
        backgroundColor: status === "booked" ? "#e6f7e6" : "#ffffff",
        color: "#000",
        fontWeight: status !== "empty" ? "500" : "normal",
        fontSize: "14px",
        minWidth: "100px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    });

    const openSlotModal = (day, time, statusObj) => {
        // Prevent editing if date is in the past
        const today = dayjs().startOf("day");
        if (day.isBefore(today)) return;

        const matchedEntry = doctorTimetable.find(entry =>
            entry.date === day.format("YYYY-MM-DD") &&
            dayjs(`${entry.date} ${entry.start_time}`).isSameOrBefore(dayjs(`${entry.date} ${dayjs(time, "hh:mm A").format("HH:mm:ss")}`)) &&
            dayjs(`${entry.date} ${entry.end_time}`).isAfter(dayjs(`${entry.date} ${dayjs(time, "hh:mm A").format("HH:mm:ss")}`))
        );

        setActiveCell({
            day,
            time,
            status: statusObj.status,
            remark: statusObj.remark,
            timetableId: matchedEntry?.id,
            start_time: matchedEntry?.start_time,
            end_time: matchedEntry?.end_time,
        });

        setModalVisible(true);
    };

    const handleAddSlot = () => {
        setSlotInfo({
            day: activeCell?.day?.format("dddd").toLowerCase(),
            date: activeCell?.day?.format("YYYY-MM-DD"),
            time: activeCell?.time,
        });
        setModalVisible(false);
        setShowAddSlot(true);
    };

    return (
        <div style={{ padding: 20 }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "12px"
            }}>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>Doctor Time Table</div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <DatePicker
                        picker="month"
                        value={selectedDate}
                        onChange={(val) => val && setSelectedDate(val.startOf("month"))}
                        style={{ width: 150 }}
                    />
                    <DatePicker
                        picker="year"
                        value={selectedDate}
                        onChange={(val) => val && setSelectedDate(val.startOf("year"))}
                        style={{ width: 120 }}
                    />
                </div>
            </div>

            {/* Time Table Grid */}
            <Spin spinning={loading}>
                <div style={{ overflowX: "auto", border: "1px solid #d9d9d9", position: "relative", maxWidth: "100%" }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: `100px repeat(${DAYS.length}, 1fr)`,
                        minWidth: `${DAYS.length * 110}px`
                    }}>
                        {/* Header Row */}
                        <div style={{
                            position: "sticky",
                            left: 0,
                            backgroundColor: "#fff",
                            zIndex: 2,
                            fontWeight: "bold",
                            border: "1px solid #d9d9d9",
                            textAlign: "center",
                            lineHeight: "45px",
                            background: "#f0f2f5"
                        }}>
                            Time
                        </div>
                        {DAYS.map((day, i) => (
                            <div key={i} style={{
                                backgroundColor: "#f0f2f5",
                                fontWeight: "bold",
                                border: "1px solid #d9d9d9",
                                textAlign: "center",
                                lineHeight: "45px",
                                minWidth: "100px"
                            }}>
                                {day.format("ddd")}<br />{day.format("DD MMM")}
                            </div>
                        ))}

                        {/* Time Rows */}
                        {TIME_SLOTS.map((time, i) => (
                            <React.Fragment key={i}>
                                <div style={{
                                    backgroundColor: "#f6ffed",
                                    border: "1px solid #d9d9d9",
                                    textAlign: "center",
                                    lineHeight: "45px",
                                    fontWeight: "500",
                                    position: "sticky",
                                    left: 0,
                                    background: "#f6ffed",
                                    zIndex: 1
                                }}>
                                    {time}
                                </div>
                                {DAYS.map((day, j) => {
                                    const statusObj = getSlotStatus(day, time);
                                    return (
                                        <div
                                            key={j}
                                            style={cellStyle(statusObj.status)}
                                            onDoubleClick={() => openSlotModal(day, time, statusObj)}
                                        >
                                            {statusObj.status === "booked" && statusObj.remark}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </Spin>

            {/* Slot Action Modal */}
            <Modal
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setModalVisible(false)}>Cancel</Button>,
                    activeCell?.status === "booked" ? (
                        <Button
                            key="update"
                            type="primary"
                            onClick={() => {
                                setUpdateData({
                                    timetableId: activeCell.timetableId,
                                    date: activeCell.day.format("YYYY-MM-DD"),
                                    start: activeCell.start_time,
                                    end: activeCell.end_time,
                                    remark: activeCell.remark,
                                });
                                setModalVisible(false);
                                setShowUpdateSlot(true);
                            }}
                        >
                            Update Slot
                        </Button>
                    ) : (
                        <Button key="add" type="dashed" onClick={handleAddSlot}>
                            Add Slot
                        </Button>
                    ),
                ]}

                title="Slot Options"
            >
                {activeCell && (
                    <>
                        <p><strong>Date:</strong> {activeCell.day.format("YYYY-MM-DD")}</p>
                        <p><strong>Day:</strong> {activeCell.day.format("dddd")}</p>
                        <p><strong>Time:</strong> {activeCell.time}</p>
                        <p><strong>Status:</strong> {activeCell.status}</p>
                        <p><strong>Remark:</strong> {activeCell.remark || "N/A"}</p>
                    </>
                )}
            </Modal>

            {/* Add Slot Modal */}
            {showAddSlot && (
                <AddNewTimeTableModal
                    open={showAddSlot}
                    day={slotInfo.day}
                    date={slotInfo.date}
                    time={slotInfo.time}
                    onCancel={() => setShowAddSlot(false)}
                />
            )}
            {/* Update Slot Modal */}
            {showUpdateSlot && updateData && (
                <UpdateTimeTableModal
                    doctorId={doctorId}
                    open={showUpdateSlot}
                    timetableId={updateData.timetableId}
                    date={updateData.date}
                    start={updateData.start}
                    end={updateData.end}
                    remark={updateData.remark}
                    onClose={() => setShowUpdateSlot(false)}
                />
            )}

        </div>
    );
};

export default DoctorTimeTable;
