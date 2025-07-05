import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Modal,
  Divider,
  Card,
  Space,
} from "antd";
import AddRecordModal from "../Modals/AddRecordModal";
import FamilyHistorySection from "../Sections/FamilyHistorySection";
import AllergiesSection from "../Sections/AllergiesSection";
import PastHospitalHistorySection from "../Sections/PastHospitalHistorySection";
import DiseasesSection from "../Sections/DiseasesSection";
import PastHospitalCurrentHistorySection from "../Sections/PastHospitalCurrentHistorySection"
import OngoingMedicationSection from "../Sections/OngoingMedicationSection";
import { GetAllDetailHistoryyy } from "../Redux/Slices/PatientSlice";
import { useDispatch } from "react-redux";

const { Title, Text } = Typography;

const HistoryTab = ({ patient,patient_id }) => {
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);
  const [customRecords, setCustomRecords] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [pastHospitalHistory, setPastHospitalHistory] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [pastHospitalCurrentHistory, setPastHospitalCurrentHistory] = useState([]);
  const [ongoingMedication, setOngoingMedication] = useState([]);
  const [loading, setLoading] = useState(false);


  const dispatch = useDispatch();
  const handleAddCustomRecord = (title, record) => {
    setCustomRecords([...customRecords, { title, record }]);
    setIsCustomModalVisible(false);
  };
  // const patient_id = patient?.id;
  console.log("patient", patient);

  useEffect(() => {
    const getAllHistory = async () => {
      try {
        setLoading(true);
        const res = await dispatch(GetAllDetailHistoryyy(patient_id)).unwrap();
        if (res) {
          setLoading(false);
        }
        setFamilyHistory(res.family_history || []);
        setAllergies(res.allergies || []);
        setPastHospitalHistory(res.past_hospital_history || []);
        setDiseases(res.diseases || []);
        setPastHospitalCurrentHistory(res.current_hospital_history || []);
        setOngoingMedication(res.ongoing_medications || []);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };

    if (patient_id) {
      getAllHistory();
    }
  }, [dispatch, patient_id]);

  return (
    <div style={{ padding: "12px 16px" }}>
      <Title level={3}>Medical History</Title>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <FamilyHistorySection familyHistory={familyHistory} loading={loading} patientId={patient_id} setFamilyHistory={setFamilyHistory} setLoading={setLoading} />
        <AllergiesSection allergies={allergies} setAllergies={setAllergies} setLoading={setLoading} patientId={patient_id} loading={loading} />
        <PastHospitalHistorySection pastHospitalHistory={pastHospitalHistory} patientId={patient_id} setLoading={setLoading} setPastHospitalHistory={setPastHospitalHistory} loading={loading} />
        <DiseasesSection diseases={diseases} patientId={patient_id} setDiseases={setDiseases} setLoading={setLoading} loading={loading} />
        <PastHospitalCurrentHistorySection pastHospitalCurrentHistory={pastHospitalCurrentHistory} setPastHospitalCurrentHistory={setPastHospitalCurrentHistory} setLoading={setLoading} patientId={patient_id} loading={loading} />
        <OngoingMedicationSection ongoingMedication={ongoingMedication} patientId={patient_id} diseases={diseases} setOngoingMedication={setOngoingMedication} setLoading={setLoading} loading={loading} />

        <Divider />

        {customRecords.length > 0 && (
          <Card title="Custom Records" style={{ borderRadius: 8 }}>
            {customRecords.map((item, index) => (
              <div key={index} style={{ marginBottom: 8 }}>
                <b>{item.title}:</b> {item.record}
              </div>
            ))}
          </Card>
        )}
      </Space>

      <AddRecordModal
        visible={isCustomModalVisible}
        onClose={() => setIsCustomModalVisible(false)}
        onSubmit={handleAddCustomRecord}
      />
    </div>
  );
};

export default HistoryTab;
