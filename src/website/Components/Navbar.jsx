import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Button, Menu } from "antd";
import { FaSearch } from "react-icons/fa";
import { DownOutlined } from "@ant-design/icons";
import ThemeContext from "../ThemeContext";
import logo from '../Images/logo.png';
import '../Styles/Navbar.css';

const Navbar = () => {
  const theme = useContext(ThemeContext);

  if (!theme || !theme.colors) {
    return null; // or a fallback loader
  }

  const loginMenu = (
    <Menu>
      <Menu.Item key="patient">
        <Link to="/web/login/patient">Patient Login</Link>
      </Menu.Item>
      <Menu.Item key="staff">
        <Link to="/web/login/staff">Staff Login</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <nav
      className="custom-navbar"
      style={{
        backgroundColor: theme.colors.background,
        borderBottom: `2px solid ${theme.colors.border}`,
        padding: '0.5rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left: Logo & Tagline */}
      <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/web/">
          <img src={logo} alt="Hospital Logo" className="navbar-logo" />
        </Link>

        <Link to="/web/">
          <div className="tagline">
            <strong style={{ color: theme.colors.primary }}>Indeed+</strong>
            <span style={{ color: theme.colors.text }}>Your Health, Our Mission</span>
          </div>
        </Link>
      </div>

      {/* Middle: Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/web/services" style={{ color: theme.colors.primary }}>OPD SERVICES</Link></li>
        <li><Link to="/web/doctors" style={{ color: theme.colors.primary }}>FIND A DOCTOR</Link></li>
        <li><Link to="/web/specialities" style={{ color: theme.colors.primary }}>SPECIALTIES</Link></li>
        <li><Link to="/web/about" style={{ color: theme.colors.primary }}>ABOUT US</Link></li>
        <li><Link to="/web/careers" style={{ color: theme.colors.primary }}>CAREERS</Link></li>
        <li><Link to="/web/contact" style={{ color: theme.colors.primary }}>CONTACT</Link></li>
      </ul>

      {/* Right: Search + Login Dropdown */}
      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <FaSearch size={18} color={theme.colors.primary} />

        <Dropdown overlay={loginMenu} trigger={['click']}>
          <Button style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
            Login <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
