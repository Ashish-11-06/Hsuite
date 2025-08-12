import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  Space,
  Typography,
  message,
  Modal
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPatients, DeletePatient } from "../Redux/Slices/PatientSlice";
import AddPatientModal from "../Modals/AddPatientModal";
import PatientDetailsDrawer from "../Modals/PatientDetailsDrawer";
import EditPatientDetailsModal from "../Modals/EditPatientDetailsModal";
import IdCard from "./IDCard";

const { Title } = Typography;
const { confirm } = Modal;

const PatientManagement = () => {
  const dispatch = useDispatch();
  const { allPatients, loading, hospital } = useSelector((state) => state.patient);

  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEditVisible, setIsEditModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("HMS-user"));

  useEffect(() => {
    dispatch(fetchAllPatients());
  }, [dispatch]);

  const filteredPatients = Array.isArray(allPatients)
    ? allPatients.filter((p) =>
      p.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      p.contact_number?.toLowerCase().includes(searchText.toLowerCase())
    )
    : [];

  const showViewDrawer = (patient) => {
    setViewingPatient(patient);
    setIsDrawerVisible(true);
  };

  const handleDeletePatient = (patientId) => {
    confirm({
      title: "Are you sure you want to delete this patient?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        dispatch(DeletePatient(patientId))
          .then((action) => {
            if (action.type.endsWith("fulfilled")) {
              message.success(action.payload?.message || "Patient deleted");
            } else {
              message.error(action.payload?.message || "Failed to delete patient");
            }
          });
      },
    });
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setIsEditModalVisible(true);
  };

  const columns = [
    { title: "Sr. No.", dataIndex: "srno", render: (_text, _record, index) => index + 1, },
    { title: "Name", dataIndex: "full_name", key: "full_name" },
    { title: "Age", dataIndex: "age", key: "age" },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (text) => (
        <Tag
          color={
            text === "Male"
              ? "blue"
              : text === "Female"
                ? "pink"
                : "green"
          }
        >
          {text}
        </Tag>

      ),
    },
    { title: "Contact", dataIndex: "contact_number", key: "contact_number" },
    {
      title: "Blood Group",
      dataIndex: "blood_group",
      key: "blood_group",
      render: (text) => <Tag color="geekblue">{text}</Tag>,
    },
  ];
  if (["admin", "receptionist", "doctor", "nurse", "lab-assistant"].includes(currentUser?.designation)) {
    columns.push({
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {/* ✅ View allowed for everyone */}
          {["admin", "nurse", "doctor"].includes(currentUser?.designation) && (
            <Button icon={<EyeOutlined />} onClick={() => showViewDrawer(record)} />
          )}

          {/* ✅ Edit/Delete only for admin or receptionist */}
          {["admin", "receptionist"].includes(currentUser?.designation) && (
            <>
              <Button icon={<EditOutlined />} onClick={() => handleEditPatient(record)} />
              {["admin"].includes(currentUser?.designation) && (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeletePatient(record.id)}
                />
              )}
            </>
          )}

          {["admin", "receptionist"].includes(currentUser?.designation) && (
            <Button
              icon={<DownloadOutlined />}
              onClick={() => IdCard(record, hospital)}
            >
              ID Card
            </Button>
          )}
        </Space>
      ),
    });
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Patient Management Dashboard</Title>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Input
          placeholder="Search by name and contact number"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />

        {["admin", "receptionist"].includes(currentUser?.designation) && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add Patient
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={filteredPatients}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <AddPatientModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      />

      {editingPatient && (
        <EditPatientDetailsModal
          visible={isModalEditVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setEditingPatient(null);
          }}
          patient={editingPatient}
        />
      )}

      <PatientDetailsDrawer
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        patient={viewingPatient}
      />
    </div>
  );
};

export default PatientManagement;
