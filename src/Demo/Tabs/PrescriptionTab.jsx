import React, { useEffect, useState } from "react";
import { Table, Button, Space, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import { FetchPrescriptionByPatientId, resetPrescriptions } from "../Redux/Slices/OpdSlice";
import dayjs from "dayjs";
import { PrescriptionPdfGenerator } from "../Pages/PrescriptionPdfGenerator";

const PrescriptionTab = ({ patient, patient_id }) => {
  const dispatch = useDispatch();
  const { prescriptions = [], hospital } = useSelector((state) => state.opd);
  const [loading, setloading] = useState(false);
  const users = useSelector((state) => state.users.users || []);

  const GetPrescriptions = async () => {
    try {
      setloading(true);
      const response = await dispatch(FetchPrescriptionByPatientId(patient_id)).unwrap();
    } catch (error) {
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (patient_id) {
      GetPrescriptions();
    }
  }, [patient_id]); // run only when patient ID changes


  useEffect(() => {
    dispatch(GetAllUsers());
  }, [dispatch]);

  const columns = [
    {
      title: "Sr. No.",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Doctor Notes",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Date",
      dataIndex: "date_issued",
      key: "date_issued",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              const doctorData = users.find((u) => u.id === record.user);
              PrescriptionPdfGenerator({
                patient_info: patient,
                doctor_info: doctorData, // You can fill in doctor info if available
                hospital_info: hospital,
                notes: record.notes,
                items: record.items,
              })
            }}

          >
            Download
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h3>Prescription Tab</h3>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={prescriptions.map((item) => ({ ...item, key: item.id }))}
          bordered
        />
      )}
    </div>
  );
};

export default PrescriptionTab;
