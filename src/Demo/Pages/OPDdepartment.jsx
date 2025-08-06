import React, { useEffect, useState, useMemo } from "react";
import { Button, Input, Space, Typography, Row, Col, Card, Progress, Spin, message, Empty, Modal, Switch } from "antd";
import { ReloadOutlined, InfoCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import DoctorNotesDrawer from "../Modals/DoctorNotesDrawer";
import GetPatientsModal from "../Modals/GetPatientsModal";
import OPDCard from "./OPDCard";
import { GetAllOPD, GetOpdByDoctorId, UpdateOPDStatus } from "../Redux/Slices/OpdSlice";
import { GetAllUsers, GetAvaliableDoctors, UpdateDoctorAvaliability } from "../Redux/Slices/UsersSlice";

const { Title } = Typography;

const TodaySummary = ({ todayStats, onRefresh }) => (
  <Card
    title={
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Today's Summary</span>
        <Button type="link" icon={<ReloadOutlined />} onClick={onRefresh} size="small" />
      </div>
    }
    style={{ borderRadius: 8, marginBottom: 16 }}
  >
    {["waiting", "out", "completed"].map((type) => (
      <div key={type} style={{ marginBottom: 12 }}>
        <p>
          {type === "waiting" ? "🕒" : type === "out" ? "✅" : "✔️"}{" "}
          {type.charAt(0).toUpperCase() + type.slice(1)}:{" "}
          <strong>{todayStats[`${type}_percentage`]}%</strong>
        </p>
        <Progress
          percent={Math.round(todayStats[`${type}_percentage`])}
          strokeColor={type === "waiting" ? "orange" : type === "out" ? "green" : "#00b96b"}
          status="active"
        />
      </div>
    ))}
  </Card>
);

const AvailableDoctors = ({ users, onRefresh }) => {
  const available = users.filter((u) => u.designation === "doctor" && u.is_doctor_available);
  return (
    <Card
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Available Doctors</span>
          <Button type="link" icon={<ReloadOutlined />} onClick={onRefresh} size="small" />
        </div>
      }
      size="small"
      style={{ borderRadius: 8 }}
    >
      {available.length > 0 ? available.map((doc) => <p key={doc.id}>{doc.name}</p>) : <p>No doctors available</p>}
    </Card>
  );
};

const OPDdepartment = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [opdRecords, setOpdRecords] = useState([]);
  const [todayStats, setTodayStats] = useState({ waiting_percentage: 0, out_percentage: 0, completed_percentage: 0 });
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewingRecord, setViewingRecord] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isPatientModalVisible, setIsPatientModalVisible] = useState(false);

  const currentUser = useMemo(() => JSON.parse(localStorage.getItem("HMS-user")), []);
  const isDoctor = currentUser?.designation === "doctor";

  const doctorsList = useMemo(() => users.filter((u) => u.designation === "doctor"), [users]);

  const filteredData = useMemo(() => {
    return opdRecords
      .filter((r) => {
        const p = r.patient || {};
        const matchSearch = [p.full_name, p.address, p.contact_number].some((f) =>
          f?.toLowerCase().includes(searchText.toLowerCase())
        );
        return matchSearch && (selectedStatus === "all" || r.status === selectedStatus);
      })
      .sort((a, b) => {
        const aEmerg = a.opd_type === "emergency" && !["completed", "out"].includes(a.status);
        const bEmerg = b.opd_type === "emergency" && !["completed", "out"].includes(b.status);
        return aEmerg === bEmerg ? 0 : aEmerg ? -1 : 1;
      });
  }, [opdRecords, searchText, selectedStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const respUsers = await dispatch(GetAllUsers()).unwrap();
      setUsers(Array.isArray(respUsers) ? respUsers : respUsers.available_doctors || []);
      const respAvail = await dispatch(GetAvaliableDoctors()).unwrap(); 
      const respOPD = await dispatch(isDoctor ? GetOpdByDoctorId(currentUser.id) : GetAllOPD()).unwrap();
      if (respOPD.data) setOpdRecords(respOPD.data);
      if (respOPD.today_stats) setTodayStats(respOPD.today_stats);
      const me = (respUsers || []).find((u) => u.id === currentUser.id);
      setIsAvailable(me?.is_doctor_available || false);
    } catch (err) {
      message.error("Failed to fetch initial data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleAvailabilityChange = async (checked) => {
    setIsAvailable(checked);
    try {
      await dispatch(UpdateDoctorAvaliability({ doctor_id: currentUser.id, is_doctor_available: checked })).unwrap();
      fetchData();
    } catch {
      // message.error("Failed to update availability");
      setIsAvailable(!checked);
    }
  };

  const handleEdit = async (updateData) => {
    try {
      await dispatch(UpdateOPDStatus(updateData)).unwrap();
      fetchData();
    } catch {
      // message.error("Failed to update OPD status");
    }
  };

  return (
    <div style={{ padding: 24, height: "100vh", display: "flex", flexDirection: "column" }}>
      <Row gutter={16}>
        <Col span={6}>
          <div style={{ position: "sticky", top: 15 }}>
            <Row align="middle" gutter={8}>
              <Col><Title level={3}>OPD Department</Title></Col>
              <Col><InfoCircleOutlined style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }} onClick={() => setIsInfoModalVisible(true)} /></Col>
            </Row>

            <TodaySummary todayStats={todayStats} onRefresh={fetchData} />

            {isDoctor && (
              <Switch
                checked={isAvailable}
                onChange={handleAvailabilityChange}
                checkedChildren="Available"
                unCheckedChildren="Unavailable"
                style={{ marginTop: 12 }}
              />
            )}

            <AvailableDoctors users={users} onRefresh={fetchData} />
          </div>
        </Col>

        <Col span={18}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <Space>
              <Input placeholder="Search patient by name/contact/address" value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 300 }} />
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ borderRadius: 4, padding: "4px 8px" }}>
                {["all", "waiting", "active", "completed", "out"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Space>

            {["receptionist", "admin"].includes(currentUser?.designation) && (
              <Button icon={<UserAddOutlined />} type="primary" onClick={() => setIsPatientModalVisible(true)}>Add OPD</Button>
            )}
          </div>

          <Card style={{ height: "calc(100vh - 160px)", overflowY: "auto", borderRadius: 8 }}>
            {loading && !opdRecords.length ? (
              <div style={{ textAlign: "center", paddingTop: 100 }}><Spin size="large" /></div>
            ) : (
              filteredData.length
                ? filteredData.map((record) => (
                    <OPDCard
                      key={record.id}
                      record={record}
                      doctors={doctorsList}
                      onView={(r) => { r.status !== "out" && setViewingRecord(r) && setIsDrawerVisible(true); }}
                      onEdit={record.status === "out" ? null : handleEdit}
                    />
                  ))
                : <Empty description="No OPD records found" />
            )}
          </Card>
        </Col>
      </Row>

      <DoctorNotesDrawer visible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} record={viewingRecord} />

      <GetPatientsModal visible={isPatientModalVisible} onClose={() => setIsPatientModalVisible(false)} onSelect={() => { setIsPatientModalVisible(false); fetchData(); }} />

      <Modal title="About OPD Department" open={isInfoModalVisible} onCancel={() => setIsInfoModalVisible(false)} footer={null}>
        <p>The Outpatient Department (OPD) handles consultations, treatment, and follow-ups without admission.</p>
        <ul>
          <li>🕒 Manage daily OPD queues</li>
          <li>📋 View patient and doctor details</li>
          <li>🩺 Add new OPD entries and notes</li>
          <li>🔍 Search and filter by name/status/type</li>
        </ul>
      </Modal>
    </div>
  );
};

export default OPDdepartment;
