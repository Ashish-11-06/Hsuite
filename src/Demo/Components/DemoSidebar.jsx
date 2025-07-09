import { Menu, Layout } from "antd";
import { useDispatch } from "react-redux";
import React, { Children } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import { logout } from "../Redux/Slices/AuthSlice";
import { Modal } from "antd";

const DemoSidebar = () => {
    const { Sider } = Layout;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        Modal.confirm({
            title: "Are you sure you want to logout?",
            content: "You will need to log in again to access your profile.",
            okText: "Logout",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => {
                dispatch(logout());
                localStorage.removeItem("HMS-user");
                navigate("/demo/logindemo");
            },
        });
    };

    const user = JSON.parse(localStorage.getItem("HMS-user"));
    const isAdmin = user?.designation === "admin";
    const isNurse = user?.designation === "nurse";
    const isDoctor = user?.designation === "doctor";
    const isReceptionist = user?.designation === "receptionist";

    const getSelectedKey = () => {
        if (location.pathname === "/demo") return "1";
        if (location.pathname === "/demo/patient") return "2";
        if (location.pathname === "/demo/opd") return "3";
        if (location.pathname === "/demo/reports") return "4";
        if (location.pathname === "/demo/billing") return "5-1";
        if (location.pathname === "/demo/finance") return "5-2";
        if (location.pathname === "/demo/users") return "6";
        // if (location.pathname === "/demo/ipd") return "7";
    }

    const menuItems = [
        {
            key: "1",
            label: <Link to="/demo">Dashboard</Link>,
        },
        {
            key: "2",
            label: <Link to="/demo/patient">Patient Management</Link>,
        },
        {
            key: "3",
            label: <Link to="/demo/opd">OPD Department</Link>,
        },
        // {
        //     key: "7",
        //     label: <Link to="/demo/ipd">IPD Department</Link>,
        // },
        ...(isAdmin || isReceptionist
            ? [
                {
                    key: "5",
                    label: "Billing & Finance",
                    children: [
                        {
                            key: "5-1",
                            label: <Link to="/demo/billing">Billing</Link>,
                        },
                        ...(isAdmin
                            ? [
                                {
                                    key: "5-2",
                                    label: <Link to="/demo/finance">Finance</Link>,
                                },
                            ]
                            : []),
                    ],
                },
            ]
            : []),

        ...(isAdmin
            ? [{
                key: "6",
                label: <Link to="/demo/users">Users</Link>,
            }]
            : []),
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogout,
        },
    ];

    return (
        <Sider>
            <div className="logo" style={{ textAlign: "center", padding: "20px", color: "black", height: "66px", fontSize: "18px", fontWeight: "bold", alignItems: "center", justifyContent: "center" }}>
                <Link to="/demo" style={{ textDecoration: "none", color: "black" }}>
                    HSuite
                </Link>
            </div>

            <Menu
                theme=""
                mode="inline"
                selectedKeys={[getSelectedKey()]}
                style={{ color: "#000", flexGrow: 1, fontWeight: 500, paddingTop: 10 }}
                items={menuItems}
            >

                {/* <Menu.Item key="1">
                    <Link to="/demo">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/demo/patient">Patient Management</Link>
                </Menu.Item>
                {!isNurse && (
                    <Menu.Item key="3">
                        <Link to="/demo/opd">OPD Department</Link>
                    </Menu.Item>
                )}
                <Menu.Item key="4">
                    <Link to="/demo/reports">Reports and Analytics</Link>
                </Menu.Item>
                <Menu.Item key="5">
                    <Link to="/demo/billing">Billing and Finance</Link>
                </Menu.Item>
                {isAdmin && (
                    <Menu.Item key="6">
                        <Link to="/demo/users">Users</Link>
                    </Menu.Item>
                )}
                {/* <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
                    Logout
                </Menu.Item>  */}
            </Menu>
        </Sider>
    )

};

export default DemoSidebar;