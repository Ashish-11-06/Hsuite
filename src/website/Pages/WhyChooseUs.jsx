// WhyChooseUs.jsx
import React from 'react';
import '../Styles/WhyChooseUs.css';
import { FaUserMd, FaClock, FaMoneyBillWave, FaLaptopMedical, FaParking } from 'react-icons/fa';

const uspData = [
  {
    icon: <FaClock />,
    title: 'Short Waiting Time',
    description: 'Spend less time in queues with our optimized appointment system.',
  },
  {
    icon: <FaUserMd />,
    title: 'Experienced Specialists',
    description: 'Consult with highly qualified and trusted medical professionals.',
  },
  {
    icon: <FaMoneyBillWave />,
    title: 'Affordable Pricing',
    description: 'Transparent and budget-friendly charges for all services.',
  },
  {
    icon: <FaLaptopMedical />,
    title: 'Online Reports & Teleconsultation',
    description: 'Access your reports from home and consult doctors online.',
  },
  {
    icon: <FaParking />,
    title: 'Easy Parking & Accessibility',
    description: 'Ample parking and wheelchair-friendly campus for convenience.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose-section">
      <h2 className="why-choose-heading">Why Choose Our OPD?</h2>
      <div className="usp-cards-container">
        {uspData.map((usp, index) => (
          <div key={index} className="usp-card">
            <h3 className="usp-title">{usp.title}</h3>
            <p className="usp-description">{usp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
