import React, { useEffect, useState } from "react";
import { Card, Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import AddCurrentHospitalModal from "../Modals/AddCurrentHospitalModal";
import { GetAllDetailHistoryyy } from "../Redux/Slices/PatientSlice";

const { Text } = Typography;

const PastHospitalCurrentHistorySection = ({
  patientId,
  pastHospitalCurrentHistory,
  setPastHospitalCurrentHistory,
  setLoading,
}) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(GetAllUsers());
  }, [dispatch]);

  const getDoctorNameById = (id) => {
    const doctor = users?.find((user) => user.id === id && user.designation === "doctor");
    return doctor ? doctor.name : "N/A";
  };

  const refreshHistory = async () => {
    try {
      setLoading(true);
      const res = await dispatch(GetAllDetailHistoryyy(patientId)).unwrap();
      setPastHospitalCurrentHistory(res.current_hospital_history || []);
    } catch (err) {
      console.error("Failed to refresh past current history", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        title={<span style={{ color: "#1890ff" }}>Past Medical History</span>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => setVisible(true)}>
            Add
          </Button>
        }
        style={{ borderRadius: 8 }}
      >
        {pastHospitalCurrentHistory?.length > 0 ? (
          pastHospitalCurrentHistory.map((entry, idx) => (
            <Card
              key={idx}
              type="inner"
              size="small"
              title={`Record #${idx + 1}`}
              style={{ marginBottom: 10 }}
            >
              <p><b>Diagnosis:</b> {entry.diagnosis_name}</p>
              <p><b>Doctor:</b> {getDoctorNameById(entry.doctor)}</p>
            </Card>
          ))
        ) : (
          <Text type="secondary">No history found for this patient.</Text>
        )}
      </Card>

      <AddCurrentHospitalModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSuccess={refreshHistory}
        patientId={patientId}
      />
    </>
  );
};

export default PastHospitalCurrentHistorySection;
