// src/pages/About.jsx

import React from "react";
import CountUp from "react-countup";
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
        <h2 className="about-heading">We’ll Treat You Well</h2>
        <p className="about-description">
          This assurance to those we serve, our workforce, and society as a whole,
          is an essential component of every Indeed ethos, inspiring us to provide
          excellence, foster creativity, and strive for continual progress.
        </p>

      
        <div className="custom-stats-layout">
          <div className="stat-box large">
            <h3><CountUp end={19} duration={2} /></h3>
            <p>Hospitals</p>
          </div>
          <div className="small-box-grid">
            <div className="stat-box small">
              <h3><CountUp end={13} duration={2} /></h3>
              <p>Clinics</p>
            </div>
            <div className="stat-box small">
              <h3><CountUp end={217} duration={2.5} /></h3>
              <p>Pharmacies</p>
            </div>
            <div className="stat-box small">
              <h3><CountUp end={243} duration={2.5} /></h3>
              <p>Labs</p>
            </div>
            <div className="stat-box small">
              <h3><CountUp end={21697} duration={3} separator="," /></h3>
              <p>Asterians</p>
            </div>
          </div>
        </div><br></br>

        <button className="network-button">Our Network</button>
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
