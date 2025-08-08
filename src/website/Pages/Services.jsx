// src/pages/Services.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../Styles/Services.css";

const services = [
  { title: "General OPD", description: "Primary care by general physicians for all age groups.", icon: "🩺" },
  { title: "Pediatrics OPD", description: "Specialized care for infants, children, and adolescents.", icon: "👶" },
  { title: "Cardiology OPD", description: "Heart care and diagnostics from expert cardiologists.", icon: "❤️" },
  { title: "Orthopedics OPD", description: "Bone and joint care, injury treatment & rehab.", icon: "🦴" },
  { title: "ENT OPD", description: "Ear, Nose & Throat treatments with advanced tools.", icon: "👂" },
  { title: "Dermatology OPD", description: "Skin, hair & nail treatments by certified dermatologists.", icon: "💆‍♀️" },
  { title: "Gynaecology OPD", description: "Women’s health, maternity and reproductive care.", icon: "🤰" },
  { title: "Neurology OPD", description: "Brain and nervous system consultation.", icon: "🧠" },
];

const Services = () => {
  return (
    <div className="services-container">
      <h2 className="services-heading">Our OPD Services</h2>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {services.map((service, index) => (
          <SwiperSlide key={index}>
            <div className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Services;
