import React, { useEffect, useState } from "react";
import "../Styles/DoctorProfile.css";
import hero2 from '../Images/doctor2.jpg';
import doctor2 from '../Images/doctor2.jpg';
import doctor3 from '../Images/doctor3.jpg';



const doctors = [
  {
    name: "Dr. Anjali Sharma",
    specialty: "Cardiologist",
    description: "Expert in heart care and cardiac diagnostics with 15+ years experience.",
    image: hero2,
  },
  {
    name: "Dr. Rajeev Mehta",
    specialty: "Neurologist",
    description: "Specialist in brain and nerve disorders with a patient-centric approach.",
    image: doctor2,
  },
  {
    name: "Dr. Priya Verma",
    specialty: "Dermatologist",
    description: "Skin and hair care specialist using advanced, painless techniques.",
    image: doctor3,
  },
];

const DoctorProfile = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const index = Math.min(
        doctors.length - 1,
        Math.floor(scrollTop / viewportHeight)
      );
      setActiveIndex(index);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="doctor-stack-container">
      <div className="doctor-sticky-wrapper">
        <div className="doctor-card-wrapper">
          {doctors.map((doc, index) => {
            let className = "doctor-card-layer";
            if (index === activeIndex) className += " active";
            else if (index === activeIndex + 1) className += " behind-1";
            else if (index === activeIndex + 2) className += " behind-2";

            return (
              <div className={className} key={index}>
                <img src={doc.image} alt={doc.name} className="doctor-img" />
                <div className="doctor-details">
                  <h2>{doc.name}</h2>
                  <h4>{doc.specialty}</h4>
                  <p>{doc.description}</p>
                  <button className="book-btn">Book Now</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;