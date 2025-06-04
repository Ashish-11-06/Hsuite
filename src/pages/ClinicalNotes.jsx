import React, { useState } from "react";
import { Button, Card } from "antd";
import NotesModal from "../Modals/NotesModal";
import { DownloadOutlined } from "@ant-design/icons";

const ClinicalNotes = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [clinicalData, setClinicalData] = useState(null);

  const handleDownload = () => {
    const content = JSON.stringify(clinicalData, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "clinical-notes.json";
    link.click();
  };

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Add Clinical Details
      </Button>

      {clinicalData && (
        <Card title="Clinical Notes" style={{ marginTop: 24 }}>
          <p><strong>Patient Name:</strong> {clinicalData.patient.name}</p>
          <p><strong>Age:</strong> {clinicalData.patient.age}</p>
          <p><strong>Gender:</strong> {clinicalData.patient.gender}</p>
          <p><strong>Blood Group:</strong> {clinicalData.patient.bloodGroup}</p>

          <p><strong>Diagnosis:</strong> {clinicalData.doctor.diagnosis}</p>
          <p><strong>Clinical Notes:</strong> {clinicalData.doctor.notes}</p>
          <p><strong>Treatment Plan:</strong> {clinicalData.doctor.treatment}</p>

          <p><strong>Tests Done:</strong> {clinicalData.lab.tests}</p>
          {clinicalData.lab.file && (
            <p><a href={clinicalData.lab.file} target="_blank" rel="noreferrer">View Lab File</a></p>
          )}

          <p><strong>MRI/CT Reports:</strong> {clinicalData.additional.report}</p>
          {clinicalData.additional.file && (
            <p><a href={clinicalData.additional.file} target="_blank" rel="noreferrer">View Additional File</a></p>
          )}

          <Button icon={<DownloadOutlined />} onClick={handleDownload}>
            Download
          </Button>
        </Card>
      )}

      <NotesModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={(data) => {
          setClinicalData(data);
          setModalVisible(false);
        }}
      />
    </div>
  );
};

export default ClinicalNotes;
