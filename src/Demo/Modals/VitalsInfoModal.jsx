import React from "react";
import { Modal, Table, Typography } from "antd";

const { Title } = Typography;

// Color helper functions (symbol-independent)
const getColor = (text) => {
  if (text.toLowerCase().includes("hypo") || text.toLowerCase().includes("brady") || text.toLowerCase().includes("underweight") || text.toLowerCase().includes("distended") || text.toLowerCase().includes("diminished") || text.toLowerCase().includes("confusion") || text.toLowerCase().includes("anemia") || text.toLowerCase().includes("risk"))
    return "#e6f7ff"; // Low - Light Blue
  if (text.toLowerCase().includes("normal"))
    return "#f6ffed"; // Normal - Light Green
  if (text.toLowerCase().includes("fever") || text.toLowerCase().includes("tachy") || text.toLowerCase().includes("hyper") || text.toLowerCase().includes("infection") || text.toLowerCase().includes("inflammation") || text.toLowerCase().includes("seizure") || text.toLowerCase().includes("coma") || text.toLowerCase().includes("tender") || text.toLowerCase().includes("wheezing") || text.toLowerCase().includes("crackles") || text.toLowerCase().includes("polycythemia"))
    return "#fff1f0"; // High - Light Red
  if (text.toLowerCase().includes("overweight") || text.toLowerCase().includes("obese"))
    return "#fffbe6"; // Warning - Light Yellow
  return undefined;
};

const getTextColor = (text) => {
  if (getColor(text) === "#fff1f0") return "#cf1322";
  if (getColor(text) === "#e6f7ff") return "#096dd9";
  if (getColor(text) === "#f6ffed") return "#389e0d";
  if (getColor(text) === "#fffbe6") return "#d48806";
  return "inherit";
};

const renderCell = (text) => ({
  props: {
    style: {
      backgroundColor: getColor(text),
      color: getTextColor(text),
      fontWeight: 500,
    },
  },
  children: text,
});

// Vital Signs Table Data
const vitalsData = [
  {
    key: "1",
    parameter: "Temperature",
    normal: "97°F – 99°F",
    low: "Hypothermia",
    normalColor: "Normal",
    high: "Fever (>100.4°F)",
  },
  {
    key: "2",
    parameter: "Pulse",
    normal: "60 – 100 bpm",
    low: "Bradycardia",
    normalColor: "Normal",
    high: "Tachycardia (>100 bpm)",
  },
  {
    key: "3",
    parameter: "Blood Pressure",
    normal: "90/60 – 120/80 mmHg",
    low: "Hypotension",
    normalColor: "Normal",
    high: "Hypertension (>130/80)",
  },
  {
    key: "4",
    parameter: "Weight",
    normal: "BMI-based",
    low: "Underweight",
    normalColor: "Normal",
    high: "Overweight / Obese",
  },
  {
    key: "5",
    parameter: "Height",
    normal: "—",
    low: "—",
    normalColor: "Normal",
    high: "—",
  },
  {
    key: "6",
    parameter: "CNS",
    normal: "Alert, oriented",
    low: "Confusion",
    normalColor: "Normal",
    high: "Seizures, coma",
  },
  {
    key: "7",
    parameter: "RS (Respiratory System)",
    normal: "Normal breath sounds",
    low: "Diminished",
    normalColor: "Normal",
    high: "Wheezing, crackles",
  },
  {
    key: "8",
    parameter: "PA (Per Abdomen)",
    normal: "Soft, non-tender",
    low: "Distended",
    normalColor: "Normal",
    high: "Tender, guarding",
  },
];

// Lab Test Table Data
const labData = [
  {
    key: "1",
    parameter: "WBC",
    normal: "4,000–11,000 /μL",
    low: "Infection risk",
    normalColor: "Normal",
    high: "Infection or inflammation",
  },
  {
    key: "2",
    parameter: "RBC",
    normal: "M: 4.7–6.1M /μL, F: 4.2–5.4M",
    low: "Anemia",
    normalColor: "Normal",
    high: "Polycythemia",
  },
];

// Table Columns
const columns = [
  {
    title: "Parameter",
    dataIndex: "parameter",
    key: "parameter",
  },
  {
    title: "Normal Range",
    dataIndex: "normal",
    key: "normal",
  },
  {
    title: "Low",
    dataIndex: "low",
    key: "low",
    render: renderCell,
  },
  {
    title: "Normal",
    dataIndex: "normalColor",
    key: "normalColor",
    render: renderCell,
  },
  {
    title: "High",
    dataIndex: "high",
    key: "high",
    render: renderCell,
  },
];

// Component
const VitalsInfoModal = ({ open, onClose }) => {
  return (
    <Modal
      title="Vital & Lab Parameters Reference"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <Title level={5}> Vital Parameters</Title>
      <Table
        dataSource={vitalsData}
        columns={columns}
        pagination={false}
        size="small"
        bordered
      />

      <Title level={5} style={{ marginTop: 24 }}>
        Lab Parameters
      </Title>
      <Table
        dataSource={labData}
        columns={columns}
        pagination={false}
        size="small"
        bordered
      />
    </Modal>
  );
};

export default VitalsInfoModal;
