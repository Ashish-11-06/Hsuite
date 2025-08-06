import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Input,
  Select,
  Button,
  Space,
  Progress,
  Empty,
  Modal,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import AddIPDModal from "../Modals/AddIPDModal";
import { fetchAllIPD, fetchIpdByDoctorId } from "../Redux/Slices/IpdSlice";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import IPDCard from "./IPDCard";

const { Text, Title } = Typography;
const { Option } = Select;

const IPDdepartment = () => {
  const dispatch = useDispatch();
  const ipdList = useSelector((state) => state.ipd.ipdList || []);

  const [openModal, setOpenModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [editingStatusIndex, setEditingStatusIndex] = useState(null);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("HMS-user"));

  useEffect(() => {
    dispatch(fetchAllIPD());
    dispatch(GetAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser?.designation === "doctor") {
      dispatch(fetchIpdByDoctorId(currentUser?.id));
    } else {
      dispatch(fetchAllIPD());
    }
    dispatch(GetAllUsers());
  }, [dispatch]);

  const handleAddIPD = () => {
    setOpenModal(true);
  };

  const handleStatusChange = (index, newStatus) => {
    // Add backend update if needed
    const updated = [...ipdList];
    updated[index].status = newStatus;
    setEditingStatusIndex(null);
  };

  const totalCount = ipdList.length;
  const normalCount = ipdList.filter((item) => item.status === "normal").length;
  const emergencyCount = ipdList.filter((item) => item.status === "emergency").length;
  const mlcCount = ipdList.filter((item) => item.status === "mlc").length;

  const filteredList = ipdList.filter((item) => {
    const matchesType = filterType === "all" || item.status === filterType;
    const matchesSearch =
      !searchText ||
      item.patient_name?.toLowerCase().includes(searchText.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div style={{ padding: 24, height: "100vh", overflowY: "hidden", display: "flex", flexDirection: "column" }}>
      <Row gutter={16} style={{ marginBottom: 5 }}>
        {/* Sidebar Summary */}
        <Col span={6}>
          <div style={{ position: "sticky", top: 15, zIndex: 10 }}>
            <Row align="middle" gutter={8}>
              <Col>
                <Title level={3} style={{ margin: 0 }}>IPD Department</Title>
              </Col>
              <Col>
                <InfoCircleOutlined
                  style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                  onClick={() => setIsInfoModalVisible(true)}
                />
              </Col>
            </Row>

            <Card title="Today's Summary" style={{ borderRadius: 8 }}>
              <div style={{ marginBottom: 12 }}>
                <p>✅ Normal: <strong>{normalCount}</strong></p>
                <Progress percent={totalCount ? Math.round((normalCount / totalCount) * 100) : 0} status="active" strokeColor="green" />
              </div>
              <div style={{ marginBottom: 12 }}>
                <p>🚨 Emergency: <strong>{emergencyCount}</strong></p>
                <Progress percent={totalCount ? Math.round((emergencyCount / totalCount) * 100) : 0} status="active" strokeColor="red" />
              </div>
              <div>
                <p>⚖️ MLC: <strong>{mlcCount}</strong></p>
                <Progress percent={totalCount ? Math.round((mlcCount / totalCount) * 100) : 0} status="active" strokeColor="orange" />
              </div>
            </Card>
          </div>
        </Col>

        {/* Main Content */}
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
                placeholder="Search patient name"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />
              <Select
                value={filterType}
                onChange={(val) => setFilterType(val)}
                suffixIcon={<FilterOutlined />}
                style={{ width: 160 }}
              >
                <Option value="all">All</Option>
                <Option value="normal">Normal</Option>
                <Option value="emergency">Emergency</Option>
                <Option value="mlc">MLC</Option>
              </Select>
            </Space>

            {["receptionist", "admin"].includes(currentUser?.designation) && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddIPD}
              >
                Add IPD
              </Button>
            )}
          </div>

          <Card
            style={{
              flex: 1,
              overflowY: "auto",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#fff",
              height: "calc(100vh - 160px)",
            }}
          >
            {filteredList.length > 0 ? (
              <Space direction="vertical" style={{ width: "100%" }}>
                {filteredList.map((item, index) => (
                  <IPDCard
                    key={index}
                    item={item}
                    index={index}
                    editingStatusIndex={editingStatusIndex}
                    onStatusChange={handleStatusChange}
                    onEditStatus={setEditingStatusIndex}
                  />
                ))}
              </Space>
            ) : (
              <Empty description="No IPD records found" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Add IPD Modal */}
      <AddIPDModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={() => dispatch(fetchAllIPD())}
      />

      {/* Info Modal */}
      <Modal
        title="About IPD Department"
        open={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
        footer={null}
      >
        <p>
          The Inpatient Department (IPD) is responsible for admitting and treating patients who require hospitalization. It includes patient admission, care management, ward assignment, and regular monitoring by doctors and nurses.
        </p>
        <ul>
          <li>🏥 Admit patients with Normal, Emergency, or MLC status</li>
          <li>📅 Track admission dates and ward allocation</li>
          <li>🩺 Assign treating doctors and capture medical reasons</li>
          <li>🧾 Filter and search based on patient type or status</li>
          <li>✍️ Double-click status tag to quickly edit patient status</li>
        </ul>
      </Modal>
    </div>
  );
};

export default IPDdepartment;
