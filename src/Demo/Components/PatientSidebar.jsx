import React, { useState } from "react";
import { Layout, Menu, message, Modal } from "antd";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  CalendarOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const PatientSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hospitalId } = useParams();
  const isMobile = window.innerWidth < 768;

 const handleLogout = () => {
  Modal.confirm({
    title: "Are you sure you want to logout?",
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      localStorage.clear();
      message.success("Logged out successfully");
      navigate(`/demo/${hospitalId}/patientregistration`);
    },
  });
};

  const getSelectedKey = () => {
    if (location.pathname.includes("patientHome")) return "1";
    if (location.pathname.includes("appointments")) return "2";
    if (location.pathname.includes("patientprofile")) return "4";
    return "";
  };

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined style={{ fontSize: 20 }} />,
      label: "Home",
      path: `/demo/${hospitalId}/patient/patientHome`,
    },
    {
      key: "2",
      icon: <CalendarOutlined style={{ fontSize: 20 }} />,
      label: "Appointments",
      path: `/demo/${hospitalId}/patient/appointments`,
    },
    {
      key: "4",
      icon: <UserOutlined style={{fontSize: 20}} />,
      label: "Profile",
      path: `/demo/${hospitalId}/patient/patientprofile`,
    },
    {
      key: "3",
      icon: <LogoutOutlined style={{ fontSize: 20 }} />,
      label: "Logout",
      action: handleLogout,
    },
  ];

  if (isMobile) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          background: "linear-gradient(to bottom, #b3e5fc, #81d4fa)",
          borderTop: "1px solid #e8e8e8",
          padding: "6px 0",
          zIndex: 999,
        }}
      >
        {menuItems.map((item) =>
          item.path ? (
            <Link
              key={item.key}
              to={item.path}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color:
                  getSelectedKey() === item.key ? "#1890ff" : "rgba(0, 0, 0, 0.65)",
              }}
            >
              <div
                style={{
                  background: "#e1f5fe",
                  borderRadius: "50%",
                  padding: 10,
                  marginBottom: 4,
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: 12 }}>{item.label}</span>
            </Link>
          ) : (
            <div
              key={item.key}
              onClick={item.action}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "rgba(0, 0, 0, 0.65)",
              }}
            >
              <div
                style={{
                  background: "#e1f5fe",
                  borderRadius: "50%",
                  padding: 10,
                  marginBottom: 4,
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: 12 }}>{item.label}</span>
            </div>
          )
        )}
      </div>
    );
  }

  // Desktop sidebar
  return (
    <Sider
      width={200}
      style={{
        background: "linear-gradient(to bottom, #b3e5fc, #81d4fa)",
        paddingTop: 20,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{
          borderRight: 0,
          background: "transparent",
        }}
        items={menuItems.map((item) =>
          item.path
            ? {
                key: item.key,
                icon: item.icon,
                label: <Link to={item.path}>{item.label}</Link>,
              }
            : {
                key: item.key,
                icon: item.icon,
                label: <div onClick={item.action}>{item.label}</div>,
              }
        )}
      />
    </Sider>
  );
};

export default PatientSidebar;
