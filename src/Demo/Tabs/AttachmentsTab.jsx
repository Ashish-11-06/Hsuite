import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Space,
  Card,
  message,
} from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { GetAttachmentsByPatientId } from "../Redux/Slices/PatientHistorySlice";
import AddAttachmentModal from "../Modals/AddAttachmentModal";
import { BASE_URL } from '../Redux/API/demoaxiosInstance'

const { Title } = Typography;

const AttachmentsTab = ({ patient }) => {
  const dispatch = useDispatch();
  const [attachments, setAttachments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAttachments = async () => {
    try {
      const response = await dispatch(GetAttachmentsByPatientId(patient.id)).unwrap();
      const processed = (response?.data || []).map((file) => ({
        ...file,
        fullUrl: `${BASE_URL}${file.file}`,
      }));
      setAttachments(processed);
    } catch (err) {
      message.error("Failed to load attachments");
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [patient.id]);

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ justifyContent: "space-between", width: "100%" }}>
        <Title level={4}>Attachments for {patient.name}</Title>
        <Button type="primary" icon={<UploadOutlined />} onClick={() => setModalOpen(true)}>
          Upload File
        </Button>
      </Space>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginTop: 24,
        }}
      >
        {attachments.map((file) => (
          <Card
            key={file.id}
            title={file.attachment_name}
            style={{ width: 240, cursor: "pointer" }}
            hoverable
            cover={
              file.file.endsWith(".pdf") ? (
                <div style={{ padding: 10, textAlign: "center" }}>
                  <FilePdfOutlined style={{ fontSize: 64, color: "#d32029" }} />
                  <p>PDF File</p>
                </div>
              ) : (
                <img
                  alt="attachment"
                  src={file.fullUrl}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                  }}
                />
              )
            }
            actions={[
              <a
                key="preview"
                href={file.fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <EyeOutlined />
              </a>,
              <Button
                key="download"
                type="text"
                icon={<DownloadOutlined />}
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const response = await fetch(file.fullUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const extension = file.file.split(".").pop();
                    const filename = `${file.attachment_name || "attachment"}.${extension}`;
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", filename);
                    link.setAttribute("target", "_blank");
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    message.error("Download failed");
                  }
                }}
              />,
            ]}
          >
            <p><strong>Type:</strong> {file.file.endsWith(".pdf") ? "PDF" : "Image"}</p>
            <p><strong>Date:</strong> {dayjs(file.date).format("YYYY-MM-DD")}</p>
          </Card>
        ))}
      </div>

      <AddAttachmentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchAttachments(); // Refresh list after upload
        }}
        patientId={patient.id}
      />
    </div>
  );
};

export default AttachmentsTab;
