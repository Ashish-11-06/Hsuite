import React, { useState } from "react";
import { Card, Button, Typography, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddHospitalHistoryModal from "../Modals/AddHospitalHistoryModal";
import { useDispatch } from "react-redux";
import { GetAllDetailHistoryyy } from "../Redux/Slices/PatientSlice";

const { Text } = Typography;

const PastHospitalHistorySection = ({ patientId, pastHospitalHistory, setPastHospitalHistory, setLoading, loading }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("HMS-user"));
const canAdd = ["admin", "nurse", "doctor"].includes(currentUser?.designation);

  const handleSuccess = async () => {
    try {
      setLoading(true);
      const res = await dispatch(GetAllDetailHistoryyy(patientId)).unwrap();
      setPastHospitalHistory(res.past_hospital_history || []);
    } catch (err) {
      // console.error("Failed to refresh hospital history", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        title={<span style={{ color: "#1890ff" }}>Past Hospital History</span>}
        extra={
           canAdd && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="small"
            onClick={() => setVisible(true)}
          >
            Add
          </Button>
           )
        }
        style={{ borderRadius: 8 }}
      >
        {loading ? (
          <div style={{ display:"flex", justifyContent: "center", padding: "20px"}}>
            <Spin tip="Loading past hospital history..." spinning={loading}>
              <div style={{height: 1}}></div>
            </Spin>
          </div>
        ): !pastHospitalHistory.length ? (
          <Text type="secondary">No past history found for this patient</Text>
        ) : (
          pastHospitalHistory.map((entry, idx) => (
            <Card
              key={entry.id || idx}
              size="small"
              type="inner"
              style={{ marginBottom: 10 }}
              title={`Hospitalization #${idx + 1}`}
            >
              <p><b>Diagnosis:</b> {entry.diagnosis_name}</p>
              <p><b>Hospital:</b> {entry.hospital_name}</p>
              <p><b>Address:</b> {entry.address}</p>
              <p><b>Doctor:</b> {entry.doctor_name}</p>
            </Card>
          ))
        )}
      </Card>

      <AddHospitalHistoryModal
        visible={visible}
        onClose={() => setVisible(false)}
        patientId={patientId}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default PastHospitalHistorySection;
