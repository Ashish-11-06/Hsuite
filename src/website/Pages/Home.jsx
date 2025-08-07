import React, { useState } from "react";
import "../Styles/Home.css";
import heroImage from "../Images/homeimg.jpg";

// Image variations for each card click
import defaultImage from "../Images/homeimg.jpg";
import imageWho from "../Images/hero1.jpg";
import imageWhen from "../Images/hero2.jpg";
import imageWhat from "../Images/hero3.jpg";
import imageWhere from "../Images/hero1.jpg";
import imageWhy from "../Images/hero4.jpg";
import imageHow from "../Images/hero5.jpg";
import About from "./About";
import Services from "./Services";
import WhyChooseUs from "./WhyChooseUs";
import DoctorProfiles from "./DoctorProfiles";

const Home = () => {
  const [bgImage, setBgImage] = useState(defaultImage);

  return (
    <div className="home-container">
      {/* Hero Section */}
      {/* <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to Indeed Hospital</h1>
            <p>Your health is our top priority.</p>
            <button className="btn-appointment">Book Appointment</button>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Hospital" />
          </div>
        </div>
      </section> */}

      {/* Interactive Section */}
      <section className="hospital-hero-section">
        <div className="hospital-hero-left">
          <h1>Welcome to Indeed Hospital</h1>
          <p>Your health is our top priority.</p>
          <button className="btn-appointment">Book Appointment</button>
          <hr />
        </div>

        <div
          className="hospital-hero-right"
          style={{ backgroundImage: `url(${bgImage})` }}
          onMouseLeave={() => setBgImage(defaultImage)}
        >
          <div
            className="hero-card who"
            onMouseEnter={() => setBgImage(imageWho)}
          >
            <span>
              WHO <em>we are</em>
            </span>
          </div>
          <div
            className="hero-card when"
            onMouseEnter={() => setBgImage(imageWhen)}
          >
            <span>
              WHEN <em>we began</em>
            </span>
          </div>
          <div
            className="hero-card what"
            onMouseEnter={() => setBgImage(imageWhat)}
          >
            <span>
              WHAT <em>we offer</em>
            </span>
          </div>
          <div
            className="hero-card where"
            onMouseEnter={() => setBgImage(imageWhere)}
          >
            <span>
              WHERE <em>we operate</em>
            </span>
          </div>
          <div
            className="hero-card why"
            onMouseEnter={() => setBgImage(imageWhy)}
          >
            <span>
              WHY <em>we innovate</em>
            </span>
          </div>
          <div
            className="hero-card how"
            onMouseEnter={() => setBgImage(imageHow)}
          >
            <span>
              HOW <em>we contribute</em>
            </span>
          </div>
        </div>
      </section>

      <About />

      {/* About Section */}
      {/* <section className="about-section">
        <h2>About Us</h2>
        <p>
          Lifecare Hospital is a leading healthcare provider with
          state-of-the-art facilities and a team of expert doctors, surgeons,
          and staff. We are committed to delivering quality care to improve
          lives.
        </p>
      </section> */}

      {/* Services Section */}
      <Services />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Doctor Profiles Section */}
      <DoctorProfiles />

      {/* Services Section */}
      {/* <section className="services-section">
        <h2>Our Services</h2>
        <div className="services-list">
          <div className="service-box">
            <h3>24/7 Emergency</h3>
            <p>Immediate and critical care round-the-clock.</p>
          </div>
          <div className="service-box">
            <h3>Cardiology</h3>
            <p>Advanced heart care by experienced cardiologists.</p>
          </div>
          <div className="service-box">
            <h3>Pediatrics</h3>
            <p>Specialized care for infants, children, and adolescents.</p>
          </div>
          <div className="service-box">
            <h3>Diagnostic Lab</h3>
            <p>Accurate testing services for timely diagnosis.</p>
          </div>
        </div>
      </section>


      <section className="contact-section">
        <h2>Need Help?</h2>
        <p>Contact us at +91-9876543210 or book an appointment online.</p>
        <button className="btn-contact">Contact Us</button>
      </section> */}
    </div>
  );
};

export default Home;
