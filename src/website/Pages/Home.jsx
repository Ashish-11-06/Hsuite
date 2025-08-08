// src/website/Pages/Home.jsx
import React, { useContext, useState } from "react";
import ThemeContext from "../ThemeContext";
import "../Styles/Home.css";

// Default image and variations
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

  // Access dynamic theme
  const { colors, fonts, spacing } = useContext(ThemeContext);

  return (
    <div
      className="home-container"
      style={{
        backgroundColor: colors?.background,
        color: colors?.text,
        fontFamily: fonts?.body,
        padding: spacing?.medium,
      }}
    >
      {/* Hero Section */}
      <section className="hospital-hero-section">
        <div className="hospital-hero-left">
          <h1 style={{ color: colors?.primary, fontFamily: fonts?.heading }}>
            Welcome to Indeed Hospital
          </h1>
          <p>Your health is our top priority.</p>
          <button
            className="btn-appointment"
            style={{
              backgroundColor: colors?.secondary,
              color: "#fff",
              border: `1px solid ${colors?.borderColor}`,
              padding: spacing?.small,
              cursor: "pointer",
            }}
          >
            Book Appointment
          </button>
          <hr />
        </div>

        <div
          className="hospital-hero-right"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
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

      {/* Website Sections */}
      <About />
      <Services />
      <WhyChooseUs />
      <DoctorProfiles />
    </div>
  );
};

export default Home;
