import { Menu, Layout } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";

const DemoSidebar = () => {
    const { Sider } = Layout;
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/demo/logindemo");
    };

    return (
        <Sider>
            <div className="logo" style={{ textAlign: "center", padding: "20px", color: "black", height: "66px", fontSize: "18px", fontWeight: "bold", alignItems: "center", justifyContent: "center" }}>
                <Link to="/demohome" style={{ textDecoration: "none", color: "black" }}>
                    HSuite
                </Link>
            </div>

            <Menu
                theme=""
                mode="inline"
                style={{ color: "#000", flexGrow: 1, fontWeight: 500, paddingTop: 10 }}
            >

                <Menu.Item>
                    <Link to="/demo/demohome">Home</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/demo/patient">Patient Management</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/demo/opd">OPD Department</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/demo/reports">Reports and Analytics</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/demo/billing">Billing and Finance</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/demo/users">Users</Link>
                </Menu.Item>

                {/* 🔴 Logout */}
                <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
                    Logout
                </Menu.Item>


            </Menu>
        </Sider>
    )

};

export default DemoSidebar;