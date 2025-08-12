import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Typography, Button } from "antd";
import HistoryTab from "../Tabs/HistoryTab";
import ClinicalNoteTab from "../Tabs/ClinicalNoteTab";
import FindingTab from "../Tabs/FindingTab";
import ReportsTab from "../Tabs/ReportsTab";
import AttachmentsTab from "../Tabs/AttachmentsTab";
import EstimateTab from "../Tabs/EstimateTab";
import PrescriptionTab from "../Tabs/PrescriptionTab";

const { Title } = Typography;

const TABS = {
  HISTORY: "History",
  CLINICAL_NOTE: "Clinical Note",
  FINDING: "Finding",
  REPORTS: "Certificates",
  ATTACHMENTS: "Attachments",
  PRESCRIPTION: "Prescription",
  // ESTIMATE: "Estimate",
};

const PatientHistory = () => {
  const { state } = useLocation();
  const patient = state?.patient;
  const patient_id = state?.patient_id;
  const [activeTab, setActiveTab] = useState(TABS.HISTORY);
// console.log('patienttt',patient_id);

  if (!patient) {
    return <p>No patient data available.</p>;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case TABS.HISTORY:
return <HistoryTab patient={patient} patient_id={patient_id} />;
      case TABS.CLINICAL_NOTE:
        return <ClinicalNoteTab patient={patient} patient_id={patient_id} />;
      case TABS.FINDING:
        return <FindingTab patient={patient} patient_id={patient_id} />;
      case TABS.REPORTS:
        return <ReportsTab patient={patient} patient_id={patient_id} />;
      case TABS.ATTACHMENTS:
        return <AttachmentsTab patient={patient} patient_id={patient_id} />;
      case TABS.PRESCRIPTION: 
        return <PrescriptionTab patient={patient} patient_id={patient_id} />;
      case TABS.ESTIMATE:
        return <EstimateTab patient={patient} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Patient History</Title>

      <Card style={{ maxWidth: 1650 }}>
        <h3><b>{patient.full_name}</b></h3>
        <p>{patient.age} | {patient.gender} | {patient.address}</p>
        <p>{patient.contact}</p>

        {/* Tab Buttons */}
        <div style={{ display: "flex", marginTop: 12, marginBottom: 16 }}>
          {Object.values(TABS).map((tab) => (
            <Button
              key={tab}
              type={activeTab === tab ? "primary" : "default"}
              onClick={() => setActiveTab(tab)}
              style={{
                borderRadius: 0,
                flex: 1,
                padding: 12,
                marginRight: 0,
                border: "1px solid #d9d9d9",
              }}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div>{renderActiveTab()}</div>
      </Card>
    </div>
  );
};

export default PatientHistory;
