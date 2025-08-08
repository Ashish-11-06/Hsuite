import React from "react";
import "../Styles/FindDoctor.css";

// Import images
import doctor1 from "../Images/doctor1.jpg";
import doctor2 from "../Images/doctor2.jpg";
import doctor3 from "../Images/doctor3.jpg";

const doctors = [
  {
    id: 1,
    name: "Dr. Ayesha Singh",
    specialty: "Cardiologist",
    education: "MD, AIIMS Delhi",
    experience: "10 years",
    image: doctor1,
  },
  {   
    id: 2,
    name: "Dr. Rohan Mehta",
    specialty: "Orthopedic Surgeon",
    education: "MS Ortho, KEM Hospital",
    experience: "8 years",
    image: doctor2,
  },
  {
    id: 3,
    name: "Dr. Sneha Sharma",
    specialty: "Dermatologist",
    education: "MD Skin, PGI Chandigarh",
    experience: "6 years",
    image: doctor3,
  },
];

const FindDoctorPage = () => {
  return (
    <div className="doctor-page">
      <h2 className="page-title">Find a Doctor</h2>
      <div className="doctor-card-container">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <img src={doctor.image} alt={doctor.name} className="doctor-image" />
            <div className="doctor-details">
              <h3>{doctor.name}</h3>
              <p><strong>Specialty:</strong> {doctor.specialty}</p>
              <p><strong>Education:</strong> {doctor.education}</p>
              <p><strong>Experience:</strong> {doctor.experience}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindDoctorPage;
