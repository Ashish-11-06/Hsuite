import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Table,
  Typography,
  Space,
} from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import AddCertificateModal from "../Modals/AddCertificateModal";
import { GetCertificates } from "../Redux/Slices/PatientHistorySlice";
import { useDispatch } from "react-redux";

const { Title } = Typography;

const ReportsTab = ({ patient }) => {
  const dispatch = useDispatch();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [reports, setReports] = useState([]); // no dummy data

  // useEffect(() => {
  //   const fetchCertificates = async () => {
  //     try {
  //       const response = await dispatch(GetCertificates(patient.id)).unwrap();
  //       setReports(response.data || []);
  //     } catch (error) {
  //       console.error("Failed to fetch certificates:", error);
  //     }
  //   };
  //     fetchCertificates();
  // }, [patient.id]);

   const fetchCertificates = async () => {
    try {
      const response = await dispatch(GetCertificates(patient.id)).unwrap();
      setReports(response.data || []);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [patient.id]);

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Description", dataIndex: "description", key: "description",
      render: (text) => (
        <Typography.Text ellipsis>{text}</Typography.Text>
      )
     },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => {
            setPreviewData(record);
            setPreviewVisible(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ justifyContent: "space-between", width: "100%" }}>
        <Title level={4}>Certificates for {patient.full_name}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCertificateModalOpen(true)}
        >
          Add Certificate
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={reports}
        rowKey="id"
        bordered
        style={{ marginTop: 24 }}
      />
      <AddCertificateModal
        open={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        patientId={patient.id}
        onCertificateAdded={fetchCertificates}
      />

      <Modal 
      title= "Certificate Preview"
      open= {previewVisible}
      onCancel={()=> setPreviewVisible(false)}
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
