import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHospitalById } from "../Redux/Slices/PatientRegisterSlice";
import PatientLoginCard from "./PatientLoginCard";
import PatientSidebar from "../Components/PatientSidebar";

const PatientRegistration = () => {
  const { hospitalId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { hospital, loading, error } = useSelector((state) => state.patientRegister);

  useEffect(() => {
    if (hospitalId) {
      dispatch(fetchHospitalById(hospitalId));
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, hospitalId]);

  // if (isLoggedIn) {
  //   return <PatientSidebar />;
  // }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100vh",
        width: "100%",
      }}
    >
      {/* Left Blue Section */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#0084ffff",
          color: "#fff",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isMobile ? "center" : "flex-start",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        {/* Logo + Title */}
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 10 }}>Hsuite</h2>
          <p style={{ fontSize: 18, marginBottom: 10 }}>
            Welcome to <strong>Hsuite Hospital Management System</strong>
          </p>
        </div>

        {/* Hospital Details */}
        {loading && <p>Loading hospital details...</p>}
        {error && <p style={{ color: "#ffcccc" }}>{error}</p>}
        {hospital && (
          <div style={{ marginTop: 30 }}>
            <h3 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>{hospital.name}</h3>
            <p><strong>Contact:</strong> {hospital.contact}</p>
            <p><strong>Address:</strong> {hospital.address}</p>
            <p><strong>Owner:</strong> {hospital.owner}</p>
          </div>
        )}
      </div>

      {/* Right White Section */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          padding: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PatientLoginCard hospitalId={hospitalId}
          onLoginSuccess={() => {
            navigate(`/demo/${hospitalId}/patient/patientHome`);
            localStorage.setItem("Hospital-Id", hospitalId);
            // setIsLoggedIn(true);
          }} />
      </div>
    </div>
  );
};

export default PatientRegistration;
