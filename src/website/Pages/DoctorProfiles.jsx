import React from "react";
import "../Styles/DoctorProfile.css";
import hero2 from "../Images/doctor2.jpg";
import doctor2 from "../Images/doctor2.jpg";
import doctor3 from "../Images/doctor3.jpg";

const doctors = [
  {
    name: "Dr. Anjali Sharma",
    specialty: "Cardiologist",
    description:
      "Expert in heart care and cardiac diagnostics with 15+ years experience.",
    image: hero2,
  },
  {
    name: "Dr. Rajeev Mehta",
    specialty: "Neurologist",
    description:
      "Specialist in brain and nerve disorders with a patient-centric approach.",
    image: doctor2,
  },
  {
    name: "Dr. Priya Verma",
    specialty: "Dermatologist",
    description:
      "Skin and hair care specialist using advanced, painless techniques.",
    image: doctor3,
  },
];

const DoctorProfile = () => {
  return (
    <section className="doctor-scroll-container">
      {doctors.map((doctor, index) => (
        <div className="doctor-card" key={index}>
          <img src={doctor.image} alt={doctor.name} className="doctor-img" />
          <div className="doctor-details">
            <h2>{doctor.name}</h2>
            <h4>{doctor.specialty}</h4>
            <p>{doctor.description}</p>
            <button className="book-btn">Book Appointment</button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default DoctorProfile;
