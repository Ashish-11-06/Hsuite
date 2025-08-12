import React, { useState, useEffect } from "react";
import { Button, Typography, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddClinicalNotesModal from "../Modals/AddClinicalNotesModal";
import { useDispatch, useSelector } from "react-redux";
import { GetClinicalNotes } from "../Redux/Slices/PatientHistorySlice";
import { DownloadOutlined } from "@ant-design/icons";
import generateClinicalNotePDF from "../Pages/generateClinicalNotePDF";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";

const { Title } = Typography;

const ClinicalNoteTab = ({ patient, patient_id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const patients = useSelector((state) => state.patient.allPatients || []);
  const users = useSelector((state) => state.users.users || []);
  const hospital = useSelector((state) => state.patient.hospital || {});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const currentUser = JSON.parse(localStorage.getItem("HMS-user"));
  const canAdd = ["admin", "nurse", "doctor"].includes(currentUser?.designation);

  const fetchClinicalNotes = async () => {
    try {
      setLoading(true);
      const response = await dispatch(GetClinicalNotes(patient_id)).unwrap();
      setClinicalNotes(response.data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicalNotes();
    dispatch(fetchAllPatients());
    dispatch(GetAllUsers());
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
                {med.pharmacy_medicine_detail?.medicine_name} - {med.dosage_amount}{med.dosage_unit} ({med.frequency.replace(/_/g, " ")})
              </li>
            ))}
          </ul>
        ) : (
          "No medicines"
        ),
    },
    { title: "Advice", dataIndex: "advice", key: "advice" },
    { title: "Follow-up Date", dataIndex: "next_followup_date", key: "next_followup_date" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="text"
          icon={<DownloadOutlined />}
          onClick={() => {
            const addedByDoctor = users.find(
              (u) => u.id === record.medicines?.[0]?.added_by
            );

            const updatedRecord = {
              ...record,
              medicines: record.medicines.map((med) => ({
                ...med,
                added_by_name: users.find((u) => u.id === med.added_by)?.name || "Unknown",
              })),
            };

            generateClinicalNotePDF({
              record: updatedRecord,
              patient,
              doctor: addedByDoctor, // ✅ Pass added_by doctor here
              hospital,
            });
          }}
        />
      ),
    }
  ];

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Clinical Notes for {patient.full_name}
        </Title>

        {canAdd && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add
          </Button>
        )}
      </div>

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
        patientId={patient_id}
        onClinicalNoteAdded={fetchClinicalNotes}
      />
    </div>
  );
};

export default ClinicalNoteTab;
