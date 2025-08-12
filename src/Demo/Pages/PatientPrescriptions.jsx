import React, { useEffect, useState } from "react";
import { Table, Card, message } from "antd";
import { useDispatch } from "react-redux";
import { FetchPrescriptionByPatientId } from "../Redux/Slices/OpdSlice";

const PatientPrescriptions = ({ patientId }) => {
  const dispatch = useDispatch();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(FetchPrescriptionByPatientId(patientId));
      if (FetchPrescriptionByPatientId.fulfilled.match(resultAction)) {
        setPrescriptions(resultAction.payload.data);
      } else {
        throw new Error(resultAction.payload?.message || "Failed to fetch prescriptions.");
      }
    } catch (error) {
      message.error(error.message || "Error occurred while fetching prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchData();
  }, [patientId]);

  const columns = [
    {
      title: "Date Issued",
      dataIndex: "date_issued",
      key: "date_issued",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Patient Name",
      dataIndex: ["patient", "full_name"],
      key: "patient_name",
    },
    {
      title: "Medicines",
      key: "items",
      render: (_, record) => (
        <>
          {record.items.map((item, index) => (
            <div key={item.id}>
              <strong>{index + 1}. {item.pharmacy_medicine.medicine_name}</strong> — {item.dosage} dose, {item.duration_days} days, Qty: {item.quantity}, ₹{item.total_price}
              <br />
              <em>Instruction: {item.instruction}</em>
            </div>
          ))}
        </>
      ),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (text) => text || "—",
    },
  ];

  return (
    <div>
    <Card title="Patient Prescriptions">
      <Table
        columns={columns}
        dataSource={prescriptions}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </Card>
    </div>
  );
};

export default PatientPrescriptions;
