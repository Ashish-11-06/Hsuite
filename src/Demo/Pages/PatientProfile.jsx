import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchPatientById } from "../Redux/Slices/PatientRegisterSlice";
import { Card, Spin, message, Tag } from "antd";

const PatientProfile = () => {
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPatientDetails = async () => {
      setLoading(true);
      try {
        const id = JSON.parse(localStorage.getItem("patient-user"))?.id;

        if (!id) {
          message.error("Patient ID not found");
          return;
        }

        const response = await dispatch(fetchPatientById(id));
        if (response?.payload?.data) {
          setPatientData(response.payload.data);
          setHospitalData(response.payload.hospital);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        // console.error("Error:", error);
        message.error("Failed to load patient data");
      } finally {
        setLoading(false);
      }
    };

    getPatientDetails();
  }, [dispatch]);

  if (loading) return <Spin tip="Loading...">
    <div style={{height: 100}}></div>
  </Spin>;

  if (!patientData) return <div>No patient data found.</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "auto", padding: "2rem" }}>
      {/* Summary Card */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ marginBottom: 0 }}>{patientData.full_name}</h2>
            <p style={{ color: "#888" }}>{patientData.email}</p>
          </div>
          <div>
            <Tag color="green">{patientData.is_active_patient ? "Active" : "Inactive"}</Tag>
          </div>
        </div>
      </Card>

      {/* Info Grid */}
      <Card title="Patient Information">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <InfoItem label="Patient ID" value={patientData.patient_id} />
          <InfoItem label="Age" value={patientData.age} />
          <InfoItem label="Gender" value={patientData.gender} />
          <InfoItem label="Date of Birth" value={patientData.dob} />
          <InfoItem label="Contact Number" value={patientData.contact_number} />
          <InfoItem
            label="Emergency Contact"
            value={patientData.emergency_contact_number || "N/A"}
          />
          <InfoItem label="Blood Group" value={patientData.blood_group || "N/A"} />
          <InfoItem label="Visit Count" value={patientData.visit_count} />
          <InfoItem label="Address" value={patientData.address} />
          <InfoItem label="Hospital Name" value={hospitalData?.name} />
          <InfoItem label="Hospital Address" value={hospitalData?.address} />
          <InfoItem label="Hospital Contact" value={hospitalData?.contact} />
          <InfoItem label="Hospital Owner" value={hospitalData?.owner} />
        </div>
      </Card>
    </div>
  );
};

// Subcomponent for field display
const InfoItem = ({ label, value }) => (
  <div>
    <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{label}</p>
    <p style={{ margin: 0, fontWeight: 500 }}>{value}</p>
  </div>
);

export default PatientProfile;
