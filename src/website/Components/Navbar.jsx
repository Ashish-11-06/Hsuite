import React from "react";
import { Link } from "react-router-dom";
import '../Styles/Navbar.css'; 
import logo from '../Images/logo.png'; 
import { FaSearch } from "react-icons/fa";
import theme from "../theme";

const Navbar = () => {
  return (
    <nav
      className="custom-navbar"
      style={{
          backgroundColor: theme.colors.background,
        borderBottom: `2px solid ${theme.colors.border}`,
        padding: '0.5rem 1.5rem'
        
      }}
    >
      <div className="logo-container">
        <img src={logo} alt="Hospital Logo" className="navbar-logo" />
        <div className="tagline">
          <strong style={{ color: theme.colors.primary }}>Indeed+</strong>
          <span style={{ color: theme.colors.text }}>Your Health, Our Mission</span>
        </div>
      </div>

      <ul className="nav-links">
        <li><Link to="/opd" style={{ color: theme.colors.primary }}>OPD SERVICES</Link></li>
        <li><Link to="/book-appointment" style={{ color: theme.colors.primary }}>BOOK APPOINTMENT</Link></li>
        <li><Link to="/doctors" style={{ color: theme.colors.primary }}>FIND A DOCTOR</Link></li>
        <li><Link to="/departments" style={{ color: theme.colors.primary }}>SPECIALTIES</Link></li>
        <li><Link to="/about" style={{ color: theme.colors.primary }}>ABOUT US</Link></li>
        <li><Link to="/careers" style={{ color: theme.colors.primary }}>CAREERS</Link></li>
        <li><Link to="/contact" style={{ color: theme.colors.primary }}>CONTACT</Link></li>
      </ul>

      <div className="search-icon">
        <FaSearch size={18} color={theme.colors.primary} />
      </div>
    </nav>
  );
};

export default Navbar;
