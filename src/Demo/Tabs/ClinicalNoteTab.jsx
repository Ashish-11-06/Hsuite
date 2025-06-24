import React, { useState, useEffect } from "react";
import { Button, Typography, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddClinicalNotesModal from "../Modals/AddClinicalNotesModal";
import { useDispatch } from "react-redux";
import { GetClinicalNotes } from "../Redux/Slices/PatientHistorySlice";
import { data } from "react-router-dom";

const { Title } = Typography;

const ClinicalNoteTab = ({ patient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchClinicalNotes = async () => {
    try {
      setLoading(true);
      const response = await dispatch(GetClinicalNotes(patient.id)).unwrap();
      setClinicalNotes(response.data || []);
    } catch (error) {
      // message.error("Failed to fetch clinical notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicalNotes();
  }, [patient.id]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchClinicalNotes(); // Refresh after adding
  };

  const columns = [
    { title: "Pain", dataIndex: "pain", key: "pain" },
    { title: "Start Date", dataIndex: "pain_start_date", key: "pain_start_date" },
    { title: "Severity", dataIndex: "pain_severity", key: "pain_severity" },
    { title: "Observation", dataIndex: "observation", key: "observation" },
    { title: "Diagnosis", dataIndex: "diagnosis", key: "diagnosis" },
    {
      title: "Medicines",
      dataIndex: "medicines",
      key: "medicines",
      render: (medicines) =>
        medicines.length > 0 ? (
          <ul style={{ paddingLeft: 20 }}>
            {medicines.map((med) => (
              <li key={med.id}>
                {med.medicine_name} - {med.dosage_amount}{med.dosage_unit} ({med.frequency.replace(/_/g, " ")})
              </li>
            ))}
          </ul>
        ) : (
          "No medicines"
        ),
    },
    { title: "Advice", dataIndex: "advice", key: "advice" },
    { title: "Follow-up Date", dataIndex: "next_followup_date", key: "next_followup_date" },
  ];

  return (
    <div style={{ padding: 12 }}>
      <Title level={4}>Clinical Notes for {patient.name}</Title>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Add
      </Button>

      <Table
        dataSource={clinicalNotes}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <AddClinicalNotesModal
        open={isModalOpen}
        onClose={handleModalClose}
        patientId={patient.id}
        onClinicalNoteAdded={fetchClinicalNotes}
      />
    </div>
  );
};

export default ClinicalNoteTab;
