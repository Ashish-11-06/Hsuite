import React from 'react';
import '../Styles/OPDServices.css'; // Assuming you have a CSS file for styling

const OPDServices = () => {
  const services = [
    {
      title: "General Consultation",
      description: "Routine check-ups, diagnosis, and treatment of common illnesses by experienced physicians."
    },
    {
      title: "Specialist Consultation",
      description: "Consultations with specialists such as cardiologists, orthopedists, dermatologists, and more."
    },
    {
      title: "Diagnostic Services",
      description: "On-site laboratory tests, X-rays, ECG, ultrasound, and other diagnostic facilities."
    },
    {
      title: "Minor Procedures",
      description: "Small surgical or therapeutic procedures that do not require hospitalization."
    },
    {
      title: "Preventive Health Checkups",
      description: "Screening packages for early detection of diseases and overall health assessment."
    },
    {
      title: "Pharmacy",
      description: "In-house pharmacy providing prescribed medicines conveniently."
    },
    {
      title: "Vaccination",
      description: "Immunization services for children and adults."
    },
    {
      title: "Physiotherapy & Rehabilitation",
      description: "Therapy sessions for recovery from injuries, surgeries, and chronic conditions."
    }
  ];

  return (
    <div className="opd-container">
      <h1>OPD Services</h1>
      <p>We offer a range of outpatient services to ensure comprehensive and timely medical care.</p>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OPDServices;
