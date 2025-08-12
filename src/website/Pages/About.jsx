// src/pages/About.jsx

import React from "react";
import { motion } from "framer-motion";
import "../Styles/About.css";
import statsImage from "../Images/hero1.jpg";

const About = () => {
  return (
    <div className="about-container">
      <motion.div
        className="about-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="about-heading">Caring for You, Every Step of the Way</h2>
        <p className="about-description">
          At Indeed Hospital, we believe in compassionate, personalized care.
          Our team of skilled professionals is committed to improving the health
          and well-being of our community. From routine check-ups to specialized
          treatments, your health is our priority.
        </p>

        <div className="custom-stats-layout">
          <div className="stat-box small">
            <h3>25+</h3>
            <p>Qualified Staff</p>
          </div>
          <div className="stat-box small">
            <h3>15+</h3>
            <p>Years of Service</p>
          </div>
          <div className="stat-box small">
            <h3>5000+</h3>
            <p>Patients Treated</p>
          </div>
          <div className="stat-box small">
            <h3>24/7</h3>
            <p>Emergency Services</p>
          </div>
        </div><br />

      </motion.div>

      <motion.div
        className="about-right"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="image-bg-wrapper">
          <img src={statsImage} alt="Doctor with patient" className="about-image" />
        </div>
      </motion.div>
    </div>
  );
};

export default About;
