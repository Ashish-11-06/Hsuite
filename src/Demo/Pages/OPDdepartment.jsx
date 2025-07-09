import React, { useState, useEffect } from "react";
import { Button, Input, Space, Typography, Row, Col, Card, Progress, Form, Spin, message, Empty, } from "antd";
import { PlusOutlined, UserAddOutlined } from "@ant-design/icons";
import DoctorNotesDrawer from "../Modals/DoctorNotesDrawer";
import GetPatientsModal from "../Modals/GetPatientsModal";
import OPDCard from "./OPDCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import { GetAllOPD, UpdateOPDStatus, GetOpdByDoctorId } from "../Redux/Slices/OpdSlice"; // Adjust the import path as necessary

const { Title } = Typography;

const OPDdepartment = () => {
  const dispatch = useDispatch();
  const { opdData, opdByDoctor, loading, error } = useSelector((state) => state.opd);
  const patients = useSelector((state) => state.patient.allPatients);
  const allUsers = useSelector((state) => state.users.users);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [isPatientModalVisible, setIsPatientModalVisible] = useState(false);
  const [patientDetails, setPatientDetails] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const currentUser = JSON.parse(localStorage.getItem("HMS-user"));

  useEffect(() => {
    dispatch(fetchAllPatients());
    dispatch(GetAllUsers());

    const fetch = async () => {
      if (currentUser?.designation === "doctor") {
        dispatch(GetOpdByDoctorId(currentUser.id));
      } else {
        const res = await dispatch(GetAllOPD());
        //  console.log('res',res);
      }
    }
    fetch()
  }, []);

  // Safely access the data array from the API response
  const records = currentUser?.designation === "doctor"
    ? opdByDoctor?.data || []
    : opdData?.data || [];

  // You would need to fetch patient details based on the patient IDs in the OPD records
  useEffect(() => {
    if (records?.length > 0 && patients?.length > 0) {
      const mappedPatients = {};

      records.forEach((record) => {
        const matchedPatient = patients.find((p) => p.id === record.patient);
        // console.log("Matched Patient:", matchedPatient);
        if (matchedPatient) {
          mappedPatients[record.patient] = {
            full_name: matchedPatient.full_name,
            age: matchedPatient.age,
            gender: matchedPatient.gender,
            address: matchedPatient.address,
            contact: matchedPatient.contact_number,
            patient_id: matchedPatient.patient_id,
          };
        }
      });

      setPatientDetails(mappedPatients);
    }
  }, [records, patients]);


  const filteredData = records.filter((record) => {
    const patient = patientDetails[record.patient] || {};
    const lowerSearch = searchText.toLowerCase();

    const matchesSearch =
      patient.full_name?.toLowerCase().includes(lowerSearch) ||
      patient.address?.toLowerCase().includes(lowerSearch) ||
      patient.contact?.toLowerCase().includes(lowerSearch);

    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleEdit = async (updateData) => {
    try {
      await dispatch(UpdateOPDStatus(updateData)).unwrap();
      if (currentUser?.designation === "doctor") {
        dispatch(GetOpdByDoctorId(currentUser.id));
      } else {
        dispatch(GetAllOPD());
      }
    } catch (error) {
    }
  };


  const handleDelete = (id) => {
    // Dispatch an action to delete the record in the backend
    message.success("Record deleted successfully!");
  };

  const waitingCount = records.filter((item) => item.status === "waiting").length;
  const outCount = records.filter((item) => item.status === "out").length;
  const newCount = records.filter((item) => item.visitType === "New").length; // Add this line
  const followUpCount = records.filter((item) => item.visitType === "Follow-Up").length; // Add this line
  const totalCount = records.length;
  const completedCount = records.filter((item) => item.status === "completed").length;

  // Mock doctors data - replace with actual doctors data from your backend
  const doctorsList = allUsers?.filter(user => user.designation === "doctor") || [];

  // if (loading) return <Spin size="large" />;
  if (error) return <div>Error: {error.message || "Failed to load OPD data"}</div>;

  return (
    <div style={{ padding: 24, height: "100vh", overflowY: "hidden", display: "flex", flexDirection: "column" }}>

      <Row gutter={16} style={{ marginBottom: 5 }}>
        <Col span={6}>
          <div style={{
            position: "sticky",
            top: 15,
            zIndex: 10
          }}>
            <Title level={3}>OPD Department</Title>
            <Card title="Today's Summary" variant="default" style={{ borderRadius: 8 }}>
              <div style={{ marginBottom: 12 }}>
                <p>
                  🕒 Waiting: <strong>{waitingCount}</strong>
                </p>
                <Progress
                  percent={totalCount > 0 ? Math.round((waitingCount / totalCount) * 100) : 0}
                  status="active"
                  strokeColor="orange"
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <p>✅ Out: <strong>{outCount}</strong></p>
                <Progress
                  percent={totalCount > 0 ? Math.round((outCount / totalCount) * 100) : 0}
                  status="active"
                  strokeColor="green"
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <p>✔️ Completed: <strong>{completedCount}</strong></p>
                <Progress
                  percent={totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}
                  status="active"
                  strokeColor="#00b96b"
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <p>🆕 New: <strong>{newCount}</strong></p>
                <Progress
                  percent={totalCount > 0 ? Math.round((newCount / totalCount) * 100) : 0}
                  status="active"
                  strokeColor="blue"
                />
              </div>

            </Card>
          </div>
        </Col>

        <Col span={18}>
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              padding: "8px 0 16px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space>
              <Input
                placeholder="Search patient by name, contact no, address"
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 4,
                  border: "1px solid #d9d9d9",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              >
                <option value="all">All</option>
                <option value="waiting">Waiting</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="out">Out</option>
              </select>
            </Space>

            {["receptionist", "admin"].includes(currentUser?.designation) && (
              <Button
                icon={<UserAddOutlined />}
                onClick={() => setIsPatientModalVisible(true)}
                type="primary"
              >
                Add OPD
              </Button>
            )}
          </div>

          <Card
            variant="outlined"
            style={{
              flex: 1,
              overflowY: "auto",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#fff",
              height: "calc(100vh - 160px)",
            }}
          >
            {loading && records.length === 0 ? (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
                <Spin size="large" />
              </div>
            ) : (
              <Space direction="vertical" style={{ width: "100%" }}>
                {filteredData.length > 0 ? (
                  filteredData.map((record) => (
                    <OPDCard
                      key={record.id}
                      record={record}
                      doctors={doctorsList}
                      patientDetails={patientDetails}
                      onView={(rec) => {
                        if (rec.status !=="out") {
                        setViewingRecord(rec);
                        setIsDrawerVisible(true);
                      }}
                    }
                      onEdit={record.status === "out" ? null : handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <Empty description="No OPD records found" />
                )}
              </Space>
            )}
          </Card>

        </Col>

      </Row>
      <DoctorNotesDrawer
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        record={viewingRecord}
      />

      <GetPatientsModal
        visible={isPatientModalVisible}
        onClose={() => setIsPatientModalVisible(false)}
        onSelect={() => {
          // console.log("onslecet from parent called")
          setIsPatientModalVisible(false);

          if (currentUser?.designation === "doctor") {
            dispatch(GetOpdByDoctorId(currentUser.id));
          } else {
            dispatch(GetAllOPD());
          }
        }}
      />
    </div>
  );
};

export default OPDdepartment;