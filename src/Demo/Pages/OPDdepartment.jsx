import React, { useState, useEffect } from "react";
import { Button,  Input, Space,Typography,Row, Col,Card,Progress,Form,Spin,message,Empty,} from "antd";
import { PlusOutlined, UserAddOutlined } from "@ant-design/icons";
import DoctorNotesDrawer from "../Modals/DoctorNotesDrawer";
import GetPatientsModal from "../Modals/GetPatientsModal";
import OPDCard from "./OPDCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";
import { GetAllOPD, UpdateOPDStatus } from "../Redux/Slices/OpdSlice"; // Adjust the import path as necessary

const { Title } = Typography;

const OPDdepartment = () => {
  const dispatch = useDispatch();
  const { opdData, loading, error } = useSelector((state) => state.opd);
  const {patients} = useSelector((state) => state.patient);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [isPatientModalVisible, setIsPatientModalVisible] = useState(false);
  const [patientDetails, setPatientDetails] = useState({});

  useEffect(() => {
    dispatch(GetAllOPD());
    dispatch(fetchAllPatients());
  }, [dispatch]);

  // Safely access the data array from the API response
  const records = opdData?.data || [];

  // You would need to fetch patient details based on the patient IDs in the OPD records
  useEffect(() => {
  if (records?.length > 0 && patients?.length > 0) {
    const mappedPatients = {};

    records.forEach((record) => {
      const matchedPatient = patients.find((p) => p.id === record.patient);
      if (matchedPatient) {
        mappedPatients[record.patient] = {
          full_name: matchedPatient.full_name,
          age: matchedPatient.age,
          gender: matchedPatient.gender,
          address: matchedPatient.address,
          contact: matchedPatient.contact_number,
        };
      }
    });

    setPatientDetails(mappedPatients);
  }
}, [records, patients]);

const filteredData = searchText
  ? records.filter((record) => {
      const patient = patientDetails[record.patient] || {};
      return patient.full_name?.toLowerCase().includes(searchText.toLowerCase());
    })
  : records;

  
const handleEdit = async (updateData) => {
  try {
    await dispatch(UpdateOPDStatus(updateData)).unwrap();
    // message.success("Record updated successfully!");
    dispatch(GetAllOPD()); // Refresh the data
  } catch (error) {
    // message.error("Failed to update record");
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
const totalCount = records.length; // Add this line

  // Mock doctors data - replace with actual doctors data from your backend
  const doctorsList = [
    { id: 16, name: "Dr. Smith" },
    { id: 17, name: "Dr. Johnson" },
    { id: 18, name: "Dr. Lee" },
  ];

  if (loading) return <Spin size="large" />;
  if (error) return <div>Error: {error.message || "Failed to load OPD data"}</div>;

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>OPD Department</Title>

        <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card title="Today's Summary" bordered style={{ borderRadius: 8 }}>
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
              <p>
                ✅ Out: <strong>{outCount}</strong>
              </p>
              <Progress
                percent={Math.round((outCount / opdData.length) * 100)}
                status="active"
                strokeColor="green"
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <p>
                🆕 New: <strong>{newCount}</strong>
              </p>
              <Progress
                percent={Math.round((newCount / opdData.length) * 100)}
                status="active"
                strokeColor="blue"
              />
            </div>

            <div>
              <p>
                🔁 Follow-Up: <strong>{followUpCount}</strong>
              </p>
              <Progress
                percent={Math.round((followUpCount / opdData.length) * 100)}
                status="active"
                strokeColor="purple"
              />
            </div>
          </Card>
        </Col>

        <Col span={18}>
          <Space
            style={{
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Input.Search
              placeholder="Search patient by name"
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Space>
              <Button
                icon={<UserAddOutlined />}
                onClick={() => setIsPatientModalVisible(true)}
              >
                Add OPD
              </Button>
            </Space>
          </Space>

          <Space direction="vertical" style={{ width: "100%" }}>
            {filteredData.length > 0 ? (
              filteredData.map((record) => (
                <OPDCard
                  key={record.id}
                  record={record}
                  doctors={doctorsList}
                  patientDetails={patientDetails}
                  onView={(rec) => {
                    setViewingRecord(rec);
                    setIsDrawerVisible(true);
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <Empty description="No OPD records found" />
            )}
          </Space>
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
        onSelect={(patient) => {
          // Handle adding new OPD record
          message.success("Patient added to OPD successfully!");
          setIsPatientModalVisible(false);
        }}
      />
    </div>
  );
};

export default OPDdepartment;