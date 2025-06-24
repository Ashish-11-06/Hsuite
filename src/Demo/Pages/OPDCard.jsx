import React, { useState } from "react";
import {
  Card,
  Typography,
  Tag,
  Button,
  Space,
  Dropdown,
  Menu,
  Select,
  Radio,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  BarChartOutlined,
  ToolOutlined,
  DownOutlined,
  AppstoreOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {UpdateOPDStatus} from "../Redux/Slices/OpdSlice"; // Adjust the import path as necessary

const { Text } = Typography;
const { Option } = Select;

const OPDCard = ({ record, onView, onEdit, onDelete, doctors = [],patientDetails = {} }) => {
  const navigate = useNavigate();

  // Local state for editing mode and form values
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(record.status || "waiting");
  const [paymentStatus, setPaymentStatus] = useState(record.payment_status || "unpaid");
  const [doctor, setDoctor] = useState(record.doctor || (doctors.length > 0 ? doctors[0].id : ""));
  const [description, setDescription] = useState(record.description || "");

  // Get patient details from the passed prop
  const patient = patientDetails[record.patient] || {};
  
  // Card background color logic based on status and paymentStatus
  const getCardBackgroundColor = () => {
    if (status === "out" && paymentStatus === "paid") return "#d9f7be"; // Light green
    if (status === "out" && paymentStatus === "unpaid") return "#ffa39e"; // Light red
    return "#fff"; // default white
  };

  // Format status for display
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format payment status for display
  const formatPaymentStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Actions menu for dropdown (only View, Delete, Edit triggers inline edit)
  const actionsMenu = (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => onView(record)}>
        View
      </Menu.Item>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => setIsEditing(true)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={() => onDelete(record.id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  // Save handler: call onEdit prop and exit editing mode
  const handleSave = () => {
    const updatedRecord = {
      ...record,
      status,
      payment_status: paymentStatus,
      doctor,
      description,
    };
    onEdit({
      id: record.id,
      body: {
        status: status
      }
    });
    setIsEditing(false);
  };

  // Cancel editing and revert changes
  const handleCancel = () => {
    setStatus(record.status || "waiting");
    setPaymentStatus(record.payment_status || "unpaid");
    setDoctor(record.doctor || (doctors.length > 0 ? doctors[0].id : ""));
    setDescription(record.description || "");
    setIsEditing(false);
  };

  const tabButtonStyle = (active) => ({
    backgroundColor: active ? "#ffe58f" : "#fafafa",
    border: `1px solid ${active ? "#fa8c16" : "#d9d9d9"}`,
    color: active ? "#fa8c16" : "#000",
    fontWeight: active ? "600" : "normal",
  });

  // Find doctor name by ID
  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : "Unknown Doctor";
  };

  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        padding: 16,
        marginBottom: 16,
        backgroundColor: getCardBackgroundColor(),
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Header: Name & Status Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Left: Patient Name */}
        <Text strong style={{ fontSize: 17 }}>
          {patient.full_name || "Unknown Patient"}
        </Text>

        {/* Right: Meta info (Visits, Date, Status) */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 6,
              padding: "2px 8px",
              fontSize: 13,
              backgroundColor: "#fafafa",
            }}
          >
            No. of Visits: <strong>{record.visit_count || 1}</strong>
          </div>

          <Text style={{ fontSize: 13 }}>
            <strong>
              {record.date_time ? dayjs(record.date_time).format("YYYY-MM-DD") : "-"}
            </strong>
          </Text>

          {!isEditing ? (
            <Tag color={status === "completed" ? "green" : status === "waiting" ? "black" : status === "active" ? "yellow": "red"}>
              {formatStatus(status)}
            </Tag>
          ) : (
            <Select
              size="small"
              value={status}
              onChange={setStatus}
              style={{ width: 120 }}
            >
              <Option value="waiting">Waiting</Option>
              <Option value ="active">Active</Option>
              <Option value="completed">Completed</Option>
              <Option value="out">Out</Option>
            </Select>
          )}
        </div>
      </div>

      {/* Patient Info */}
      <div style={{ marginTop: 8 }}>
        <div>
          {patient.age || "-"} | {patient.gender || "-"} | {patient.address || "-"}
        </div>
        <div>
          {patient.contact || "-"} | ID: {record.id}
        </div>
        <div style={{ marginTop: 4 }}>
          Doctor:{" "}
          {!isEditing ? (
            <Text>{getDoctorName(record.doctor)}</Text>
          ) : (
            <Select
              size="small"
              value={doctor}
              style={{ minWidth: 120 }}
              onChange={setDoctor}
            >
              {doctors.map((doc) => (
                <Option key={doc.id} value={doc.id}>
                  {doc.name}
                </Option>
              ))}
            </Select>
          )}
        </div>

        {/* Description */}
        {description && (
          <div style={{ marginTop: 4 }}>
            Description: <Text>{description}</Text>
          </div>
        )}

        {/* Payment Status */}
        <div style={{ marginTop: 4 }}>
          Payment Status:{" "}
          {!isEditing ? (
            <Tag color={paymentStatus === "paid" ? "green" : "red"}>
              {formatPaymentStatus(paymentStatus)}
            </Tag>
          ) : (
            <Radio.Group
              size="small"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="paid" style={{ borderRadius: "4px 0 0 4px" }}>
                Paid
              </Radio.Button>
              <Radio.Button value="unpaid" style={{ borderRadius: "0 4px 4px 0" }}>
                Unpaid
              </Radio.Button>
            </Radio.Group>
          )}
        </div>
      </div>

      {/* Tab-like Navigation and Edit Save/Cancel Buttons */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {!isEditing ? (
          <>
            <Button
              icon={<FileTextOutlined />}
              size="small"
              style={tabButtonStyle(status === "out")}
              onClick={() => navigate(`/demo/opd-bill/${record.id}`)}
            >
              OPD Bill
            </Button>

            <Dropdown overlay={actionsMenu} trigger={["click"]}>
              <Button size="small" icon={<AppstoreOutlined />}>
                Actions <DownOutlined />
              </Button>
            </Dropdown>
          </>
        ) : (
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              size="small"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              size="small"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Space>
        )}
      </div>
    </Card>
  );
};

export default OPDCard;