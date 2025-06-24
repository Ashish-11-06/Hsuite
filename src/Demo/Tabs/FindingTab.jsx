import React, { useEffect, useState } from "react";
import { Button, Table, Typography, Space, Tag } from "antd";
import { PlusOutlined, QuestionCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetFinding } from "../Redux/Slices/PatientHistorySlice";
import AddFindingModal from "../Modals/AddFindingModal";
import VitalsInfoModal from "../Modals/VitalsInfoModal";
import EditFindingModal from "../Modals/EditFindingModal";

const { Title } = Typography;

const getVitalStatus = (field, value) => {
  const v = parseFloat(value);
  if (isNaN(v)) {
    const text = value?.toLowerCase?.();
    if (text?.includes("normal")) return { label: value, color: "green" };
    if (text?.includes("abnormal") || text?.includes("dull")) return { label: value, color: "red" };
    return { label: value || "-", color: "default" };
  }

  switch (field) {
    case "temperature":
      if (v < 97) return { label: value, color: "blue" };
      if (v > 100.4) return { label: value, color: "red" };
      return { label: value, color: "green" };

    case "pulse":
      if (v < 60) return { label: value, color: "blue" };
      if (v > 100) return { label: value, color: "red" };
      return { label: value, color: "green" };

    case "blood_pressure":
      if (typeof value === "string" && value.includes("/")) {
        const [systolic, diastolic] = value.split("/").map(Number);
        if (systolic < 90 || diastolic < 60) return { label: value, color: "blue" };
        if (systolic > 130 || diastolic > 80) return { label: value, color: "red" };
        return { label: value, color: "green" };
      }
      return { label: value, color: "default" };

    case "weight":
      if (v < 18.5) return { label: value, color: "blue" };
      if (v >= 25) return { label: value, color: "gold" };
      return { label: value, color: "green" };

    case "wbc":
      if (v < 4000) return { label: value, color: "blue" };
      if (v > 11000) return { label: value, color: "red" };
      return { label: value, color: "green" };

    case "rbc":
      if (v < 4) return { label: value, color: "blue" };
      if (v > 6.5) return { label: value, color: "red" };
      return { label: value, color: "green" };

    default:
      return { label: value, color: "default" };
  }
};

// Renderer for each field
const renderVitalTag = (field) => (text) => {
  const { label, color } = getVitalStatus(field, text);
  return <Tag color={color}>{label}</Tag>;
};


const FindingTab = ({ patient }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState(null);

  const { findings, loading, message } = useSelector((state) => state.patienthistory);

  useEffect(() => {
    if (patient?.id) {
      dispatch(GetFinding(patient.id));
    }
  }, [dispatch, patient?.id]);

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "srno",
      key: "srno",
      render: (_, __, index) => index + 1,
    },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Temperature", dataIndex: "temperature", key: "temperature", render: renderVitalTag("temperature") },
    { title: "Pulse", dataIndex: "pulse", key: "pulse", render: renderVitalTag("pulse") },
    { title: "BP", dataIndex: "blood_pressure", key: "blood_pressure", render: renderVitalTag("blood_pressure") },
    { title: "Weight", dataIndex: "weight", key: "weight", render: renderVitalTag("weight") },
    { title: "Height", dataIndex: "height", key: "height" }, // just display plain
    { title: "CNS", dataIndex: "cns", key: "cns", render: renderVitalTag("cns") },
    { title: "RS", dataIndex: "rs", key: "rs", render: renderVitalTag("rs") },
    { title: "PA", dataIndex: "pa", key: "pa", render: renderVitalTag("pa") },
    { title: "WBC", dataIndex: "wbc", key: "wbc", render: renderVitalTag("wbc") },
    { title: "RBC", dataIndex: "rbc", key: "rbc", render: renderVitalTag("rbc") },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedFinding(record);
            setEditModalVisible(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={4}>Findings for {patient?.name || "Patient"}</Title>
        <Space>
          <Button icon={<QuestionCircleOutlined />} onClick={() => setInfoModalVisible(true)} type="default">
            Vitals Info
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            New Record
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={findings?.map((item, index) => ({ ...item, key: index }))}
        loading={loading}
        bordered
        style={{ marginTop: 24 }}
        scroll={{ x: true }}
        locale={{
          emptyText: message || "No findings found for this patient",
        }}
      />

      <AddFindingModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        patientId={patient.id}
      />

      <EditFindingModal
        open={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        finding={selectedFinding}
        patientId={patient.id}
      />

      <VitalsInfoModal
        open={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
    </div>
  );
};

export default FindingTab;
