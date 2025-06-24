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
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPatients, DeletePatient } from "../Redux/Slices/PatientSlice";

import AddPatientModal from "../Modals/AddPatientModal";
import PatientDetailsDrawer from "../Modals/PatientDetailsDrawer";
import EditPatientDetailsModal from "../Modals/EditPatientDetailsModal";

const { Title } = Typography;
const { confirm } = Modal;

const PatientManagement = () => {
  const dispatch = useDispatch();
  const { allPatients, loading } = useSelector((state) => state.patient);

  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEditVisible, setIsEditModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPatients());
  }, [dispatch]);

 const filteredPatients = Array.isArray(allPatients)
  ? allPatients.filter((p) =>
      p.full_name?.toLowerCase().includes(searchText.toLowerCase())
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
    { title: "#", dataIndex: "id", key: "id" },
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
                ? "pink" // light pink (hex code)
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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => showViewDrawer(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEditPatient(record)} />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePatient(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Patient Management Dashboard</Title>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search by name"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Patient
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredPatients}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
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
