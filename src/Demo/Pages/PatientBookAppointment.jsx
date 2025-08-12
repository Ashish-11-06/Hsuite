// components/PatientBookAppointment.jsx

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetAvaliableDoctors } from "../Redux/Slices/UsersSlice";
import { Select, Spin, Card, Row, Col, Button, message } from "antd";
import PatientBookAppointmentModal from "../Modals/PatientBookAppointmentModal";
import { BASE_URL } from "../Redux/API/demoaxiosInstance";

const { Option } = Select;

const PatientBookAppointment = () => {
  const dispatch = useDispatch();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await dispatch(GetAvaliableDoctors()).unwrap();

        if (
          response &&
          Array.isArray(response.available_doctors)
        ) {
          setDoctors(response.available_doctors);
        } else {
          message.warning("Unexpected response structure for doctors list.");
          setDoctors([]);
        }
      } catch (error) {
        // console.error("Error fetching available doctors:", error);
        message.error("Failed to fetch doctors.");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [dispatch]);

  useEffect(() => {
    if (!selectedDepartment || selectedDepartment === "all") {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter((doc) => {
        return (
          doc.doctor_profile &&
          doc.doctor_profile.specialization &&
          doc.doctor_profile.specialization.toLowerCase() === selectedDepartment.toLowerCase()
        );
      });
      setFilteredDoctors(filtered);
    }
  }, [selectedDepartment, doctors]);


  // Open modal with selected doctor
  const openBookingModal = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDoctor(null);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
        Book Appointment
      </h2>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: "10px", fontWeight: "500" }}>
          Select Specialization:
        </span>
        <Select
          placeholder="e.g. Cardiology, Neurology"
          onChange={setSelectedDepartment}
          style={{ width: 250 }}
          allowClear
          value={selectedDepartment}
        >
          {/* Static Departments */}
          <Option value="all">All</Option>
          <Option value="cardiology">Cardiology</Option>
          <Option value="neurology">Neurology</Option>
          <Option value="orthopedics">Orthopedics</Option>
          <Option value="dermatology">Dermatology</Option>
          <Option value="pediatrics">Pediatrics</Option>
          <Option value="gynecology">Gynecology</Option>
          <Option value="psychiatry">Psychiatry</Option>
          <Option value="general_medicine">General Medicine</Option>
          <Option value="ent">ENT</Option>
          <Option value="other">Other</Option>
        </Select>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredDoctors.map((doctor) => (
            <Col xs={24} sm={12} md={12} key={doctor.id}>
              <Card
                variant="bordered"
                style={{ borderRadius: "8px", height: "100%" }}
              >
                <div style={{ display: "flex", gap: "16px" }}>
                  {/* Doctor Photo */}
                  <img
                    src={
                      doctor?.doctor_profile?.photo
                        ? `${BASE_URL}${doctor.doctor_profile.photo}`
                        : "/placeholder.jpg"
                    }
                    alt={doctor.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Doctor Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: "8px" }}>{doctor.name}</h3>

                    <p style={{ margin: 0 }}>
                      <strong>Specialization:</strong>{" "}
                      {doctor?.doctor_profile?.specialization || "N/A"}
                    </p>

                    <p style={{ margin: 0 }}>
                      <strong>Experience:</strong>{" "}
                      {doctor?.doctor_profile?.experience_years ?? "N/A"} years
                    </p>

                    <p style={{ marginBottom: "12px" }}>
                      <strong>Qualification:</strong>{" "}
                      {doctor?.doctor_profile?.qualification || "N/A"}
                    </p>

                    <Button
                      type="primary"
                      block
                      onClick={() => openBookingModal(doctor)}
                    >
                      Book this doctor
                    </Button>
                  </div>
                </div>
              </Card>

            </Col>
          ))}
        </Row>
      )}

      {selectedDoctor && (
        <PatientBookAppointmentModal
          visible={modalVisible}
          onClose={closeModal}
          doctor={selectedDoctor}
          department={selectedDepartment}
        />
      )}
    </div>
  );
};

export default PatientBookAppointment;
