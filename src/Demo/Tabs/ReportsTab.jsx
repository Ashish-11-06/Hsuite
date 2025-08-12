import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Table,
  Typography,
  Space,
} from "antd";
import { PlusOutlined, EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import AddCertificateModal from "../Modals/AddCertificateModal";
import { GetCertificates } from "../Redux/Slices/PatientHistorySlice";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { downloadCertificatePDF } from "../Pages/downloadCertificatePDF";

const { Title } = Typography;

const ReportsTab = ({ patient, patient_id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [hospital, setHospital] = useState([]);
  const [loading, setloading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("HMS-user"));
  const canAdd = ["admin", "nurse", "doctor"].includes(currentUser?.designation);

  const fetchDoctors = async () => {
    try {
      const response = await dispatch(GetAllUsers()).unwrap(); // Assuming this thunk exists
      // console.log('doctore res', response);
      setDoctors(response || []);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    }
  };

  const getDoctorNameById = (id) => {
    const doctor = doctors.find(doc => doc.id === id);
    return doctor ? doctor.name : "Unknown Doctor";
  };


  const fetchCertificates = async () => {
    try {
      setloading(true);
      const response = await dispatch(GetCertificates(patient_id)).unwrap();
      // console.log(response)
      setReports(response.data || []);
      setHospital(response.hospital || {});
      // console.log(response.hospital);
    } catch (error) {
      // console.error("Failed to fetch certificates:", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
    fetchDoctors();
  }, [patient.id]);

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Description", dataIndex: "description", key: "description",
      render: (text) => (
        <Typography.Text ellipsis>{text}</Typography.Text>
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <>
            <Button
              icon={<EyeOutlined />}
              onClick={() => downloadCertificatePDF({
                ...record, patient_name: patient.full_name,
                patient_age: patient.age,
                patient_gender: patient.gender,
                patient_address: patient.address,
                doctor_name: getDoctorNameById(record.added_by),
                hospital_name: hospital.name,
                hospital_address: hospital.address,
                hospital_contact: hospital.contact,
              }, true)}
            >
              View
            </Button>
          </>
          <Button
            type="default"
            icon={<DownloadOutlined />}
            onClick={() =>
              downloadCertificatePDF({
                ...record, patient_name: patient.full_name,
                patient_age: patient.age,
                patient_gender: patient.gender,
                patient_address: patient.address,
                doctor_name: getDoctorNameById(record.added_by),
                hospital_name: hospital.name,
                hospital_address: hospital.address,
                hospital_contact: hospital.contact,
              }, false)
            }
          >
            Download
          </Button>

        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ justifyContent: "space-between", width: "100%" }}>
        <Title level={4}>Certificates for {patient.full_name}</Title>
        {canAdd && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCertificateModalOpen(true)}
          >
            Add Certificate
          </Button>
        )}
      </Space>

      <Table
        columns={columns}
        dataSource={reports}
        rowKey="id"
        bordered
        loading={loading}
        style={{ marginTop: 24 }}
      />
      <AddCertificateModal
        open={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        patientId={patient_id}
        onCertificateAdded={fetchCertificates}
      />

      <Modal
        title="Certificate Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}>
        {previewData && (
          <div>
            <p><strong>Date:</strong> {previewData.date}</p>
            <p><strong>Description:</strong> {previewData.description}</p>
            <p><strong>Remark:</strong> {previewData.remark}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportsTab;
