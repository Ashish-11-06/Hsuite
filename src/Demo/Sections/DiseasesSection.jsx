import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Table,
  Tag,
  Select,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import AddDiseasesModal from "../Modals/AddDiseasesModal";
import { UpdateDiseasesStatus } from "../Redux/Slices/PatientHistorySlice";
import { GetAllDetailHistoryyy } from "../Redux/Slices/PatientSlice";

const { Text } = Typography;
const { Option } = Select;

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "recovered", label: "Recovered" },
  { value: "ongoing", label: "Ongoing" },
  { value: "chronic", label: "Chronic" },
];

const severityOptions = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
  { value: "critical", label: "Critical" },
];

const DiseasesSection = ({
  patientId,
  diseases,
  setDiseases,
  setLoading,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [severityValue, setSeverityValue] = useState("");

  const dispatch = useDispatch();

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await dispatch(GetAllDetailHistoryyy(patientId)).unwrap();
      setDiseases(res.diseases || []);
    } catch (err) {
      console.error("Failed to refetch diseases", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (record) => {
    setEditingId(record.id);
    setStatusValue(record.status);
    setSeverityValue(record.severity);
  };

  const handleChangeAndSave = async (newStatus, newSeverity, record) => {
    try {
      await dispatch(
        UpdateDiseasesStatus({
          id: record.id,
          payload: {
            status: newStatus,
            severity: newSeverity,
          },
        })
      ).unwrap();
      setEditingId(null);
      fetchAll(); // ✅ re-fetch on update
    } catch (err) {
      console.error("Failed to update disease");
    }
  };

  const columns = [
    {
      title: "Diagnosis Date",
      dataIndex: "diagnosis_date",
      key: "diagnosis_date",
      render: (date) => dayjs(date).format("DD-MM-YYYY"),
    },
    {
      title: "Disease Name",
      dataIndex: "disease_name",
      key: "disease_name",
    },
    {
      title: "Severity",
      key: "severity",
      render: (_, record) =>
        editingId === record.id ? (
          <Select
            value={severityValue}
            onChange={(val) => {
              setSeverityValue(val);
              handleChangeAndSave(statusValue, val, record);
            }}
            style={{ width: 120 }}
            size="small"
          >
            {severityOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        ) : (
          <Tag color="blue">{record.severity}</Tag>
        ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) =>
        editingId === record.id ? (
          <Select
            value={statusValue}
            onChange={(val) => {
              setStatusValue(val);
              handleChangeAndSave(val, severityValue, record);
            }}
            style={{ width: 120 }}
            size="small"
          >
            {statusOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        ) : (
          <Tag color="green">{record.status}</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEditClick(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<span style={{ color: "#1890ff" }}>Diseases</span>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="small"
            onClick={() => setIsModalVisible(true)}
          >
            Add
          </Button>
        }
        style={{ borderRadius: 8 }}
      >
        {diseases && diseases.length > 0 ? (
          <Table
            columns={columns}
            dataSource={diseases}
            rowKey="id"
            pagination={false}
          />
        ) : (
          <Text type="secondary">No diseases found for this patient.</Text>
        )}
      </Card>

      <AddDiseasesModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={fetchAll}
        patientId={patientId}
      />
    </>
  );
};

export default DiseasesSection;
