import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  AuditOutlined,
  SafetyCertificateOutlined,
  ContainerOutlined,
  IdcardOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";

const { SubMenu } = Menu;

const MHSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // ✅ Check localStorage for user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("medicalUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("medicalUser");
    localStorage.removeItem("medicalRole");
    localStorage.removeItem("medicalToken");
    setUser(null);
    navigate("/medicalHealth/mhlogin"); // 👈 redirect to login
  };

  const getSelectedKey = () => {
    if (location.pathname === "/medicalHealth") return "1";
    if (
      location.pathname.startsWith("/medicalHealth/assessment") ||
      location.pathname.startsWith("/medicalHealth/createset") ||
      location.pathname.startsWith("/medicalHealth/assessents") ||
      location.pathname.startsWith("/medicalHealth/report") ||
      location.pathname.startsWith("/medicalHealth/createmcq") ||
      location.pathname.startsWith("/medicalHealth/mcqtest") ||
      location.pathname.startsWith("/medicalHealth/mcqreport") ||
      location.pathname.startsWith("/medicalHealth/createegogram") ||
      location.pathname.startsWith("/medicalHealth/testegogram") ||
      location.pathname.startsWith("/medicalHealth/egogramreport")
    ) {
      return "2";
    }
    if (location.pathname.startsWith("/medicalHealth/treatment")) return "3";
    if (location.pathname.startsWith("/medicalHealth/mindfulness")) return "4";
    if (location.pathname.startsWith("/medicalHealth/blog")) return "7";
    if (location.pathname.startsWith("/medicalHealth/mhprofile")) return "5";
    if (location.pathname.startsWith("/medicalHealth/mhlogin")) return "6";
    return "1";
  };

  return (
    <div
      style={{
        width: "100%",
        background: "linear-gradient(to bottom, #00BFFF, #87CEFA)",
        height: "66px",
        display: "flex",
        alignItems: "center",
        padding: "0 30px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      {/* Left side: Logo */}
      <div
        className="logo"
        style={{
          color: "black",
          fontSize: "20px",
          fontWeight: "bold",
          lineHeight: "66px",
          marginRight: "30px",
        }}
      >
        <Link to="/medicalHealth" style={{ textDecoration: "none", color: "black" }}>
          HSuite
        </Link>
      </div>

      {/* Full Navigation */}
      <Menu
        mode="horizontal"
        selectedKeys={[getSelectedKey()]}
        style={{
          color: "#000",
          fontWeight: 500,
          background: "transparent",
          borderBottom: "none",
          flex: 1,
          display: "flex",
        }}
      >
        {/* Center items */}
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/medicalHealth">Home</Link>
        </Menu.Item>

        <Menu.Item key="2" icon={<AuditOutlined />}>
          <Link to="/medicalHealth/assessment">Assessments</Link>
        </Menu.Item>

        <SubMenu key="3" icon={<SafetyCertificateOutlined />} title="Treatment">
          <Menu.Item key="3-1" icon={<ContainerOutlined />}>
            <Link to="/medicalHealth/treatment">Predefined Treatment</Link>
          </Menu.Item>
          <Menu.Item key="3-2" icon={<IdcardOutlined />}>
            <Link to="/medicalHealth/counsellor">Counsellors</Link>
          </Menu.Item>
          <Menu.Item key="3-3" icon={<MedicineBoxOutlined />}>
            <Link to="/medicalHealth/counsellortreatment">
              Counsellor Treatment
            </Link>
          </Menu.Item>
          <Menu.Item key="3-4" icon={<ClockCircleOutlined />}>
            <Link to="/medicalHealth/ongocountreatment">
              Ongoing Counsellor Treatment
            </Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item key="4" icon={<AuditOutlined />}>
          <Link to="/medicalHealth/mindfulness">Mindfulness</Link>
        </Menu.Item>

        <Menu.Item key="7" icon={<ReadOutlined />}>
          <Link to="/medicalHealth/blog">Blog</Link>
        </Menu.Item>

        {/* Right side items */}
        <Menu.Item
          key="5"
          icon={<UserOutlined />}
          style={{ marginLeft: "auto" }} // ✅ pushes to right
        >
          <Link to="/medicalHealth/mhprofile">Profile</Link>
        </Menu.Item>

        {user ? (
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        ) : (
          <Menu.Item key="6" icon={<LoginOutlined />}>
            <Link to="/medicalHealth/mhlogin">Login</Link>
          </Menu.Item>
        )}
      </Menu>
    </div>
  );
};

export default MHSidebar;
