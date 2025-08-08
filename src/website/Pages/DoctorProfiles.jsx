import React, { useEffect, useRef, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollRef.current;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      const index = Math.min(
        doctors.length - 1,
        Math.floor(scrollTop / containerHeight)
      );

      setActiveIndex(index);
    };

    const container = scrollRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="doctor-stack-container" ref={scrollRef}>
      <div className="doctor-sticky-wrapper">
        <div className="doctor-card-wrapper">
          {doctors.map((doctor, index) => {
            let className = "doctor-card-layer";

            if (index === activeIndex) className += " active";
            else if (index === activeIndex - 1) className += " behind-1";
            else if (index === activeIndex - 2) className += " behind-2";

            return (
              <div className={className} key={index}>
                <div className="doctor-card">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="doctor-img"
                  />
                  <div className="doctor-details">
                    <h2>{doctor.name}</h2>
                    <h4>{doctor.specialty}</h4>
                    <p>{doctor.description}</p>
                    <button className="book-btn">Book Appointment</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DoctorProfile;
