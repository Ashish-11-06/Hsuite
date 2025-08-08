import { Menu, Layout } from "antd";
import { useDispatch } from "react-redux";
import React, { Children } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AccountBookOutlined, LogoutOutlined, MedicineBoxOutlined, UserAddOutlined, UsergroupAddOutlined, WalletOutlined, SnippetsOutlined, BarChartOutlined, DollarCircleOutlined, AppstoreAddOutlined, TeamOutlined, BuildOutlined, ShoppingOutlined, FileTextFilled, SolutionOutlined, DatabaseOutlined, ExperimentOutlined, ApartmentOutlined, UserOutlined } from "@ant-design/icons";
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
    const isPharmacist = user?.designation === "pharmacist";
    const isLabAssistant = user?.designation === "lab_assistant";

    const getSelectedKey = () => {
        if (location.pathname === "/demo") return "1";
        if (location.pathname === "/demo/patient") return "2";
        if (location.pathname === "/demo/opd") return "3-1";
        if (location.pathname === "/demo/pastopd") return "3-2";
        if (location.pathname === "/demo//appointment") return "3-3";
        if (location.pathname === "/demo/doctortimetable") return "3-4";
        if (location.pathname === "/demo/reports") return "4";
        if (location.pathname === "/demo/billing") return "5-1";
        if (location.pathname === "/demo/finance") return "5-2";
        if (location.pathname === "/demo/invoice") return "5-3";
        if (location.pathname === "/demo/users") return "6";
        if (location.pathname === "/demo/ipd") return "7";
        if (location.pathname === "/demo/bedstatus") return "8";
        if (location.pathname === "/demo/pharmacy") return "9-1";
        if (location.pathname === "/demo/supplier") return "9-2";
        if (location.pathname === "/demo/report") return "9-5";
        if (location.pathname === "/demo/stockitems") return "9-3";
        if (location.pathname === "/demo/medicine") return "9-4";
        if (location.pathname === "/demo/newbill") return "9-6";
        if (location.pathname === "/demo/presInvoice") return "9-7";
        if (location.pathname === "/demo/profile") return "10";
        if (location.pathname === "/demo/lab") return "11-1";
        if (location.pathname === "/demo/birth") return "11-2";
        if (location.pathname === "/demo/death") return "11-3";
        return "1";
    }

    const menuItems = [
        {
            key: "1",
            icon: <AppstoreAddOutlined />,
            label: <Link to="/demo">Dashboard</Link>,
        },
        {
            key: "2",
            icon: <UserAddOutlined />,
            label: <Link to="/demo/patient">Patient Management</Link>,
        },

        {
            key: "3",
            label: "OPD",
            // icon: <ShoppingOutlined />,
            children: [
                {
                    key: "3-1",
                    icon: <MedicineBoxOutlined />,
                    label: <Link to="/demo/opd">OPD Department</Link>,
                },
                ...(isAdmin || isDoctor || isNurse
                    ? [
                        {
                            key: "3-2",
                            icon: <SolutionOutlined />,
                            label: <Link to="/demo/pastopd">Past OPD Patient Records</Link>,
                        },
                    ]
                    : []),
                ...(isDoctor
                    ? [
                        {
                            key: "3-3",
                            // icon: <DatabaseOutlined />,
                            label: <Link to="/demo/appointment">Appointments</Link>,
                        },
                        {
                            key: "3-4",
                            //icon: < />,
                            label: <Link to="/demo/doctortimetable">TimeTable</Link>
                        }
                    ]
                    : []),
            ]
        },
        {
            key: "4",
            icon: <BarChartOutlined />,
            label: <Link to="/demo/reports">Reports and Analytics</Link>,
        },
        // {
        //     key: "7",
        //     icon: <TeamOutlined />,
        //     label: "IPD Department",
        //     children: [
        //         {
        //             key: "7",
        //             icon: <TeamOutlined />,
        //             label: <Link to="/demo/ipd">IPD Department</Link>,
        //         },
        //         ...(isAdmin || isNurse || isReceptionist ? [
        //             {
        //                 key: "8",
        //                 icon: <ApartmentOutlined />,
        //                 label: <Link to="/demo/bedstatus">Bed Management</Link>,
        //             },
        //         ] : []),
        //     ]
        // },
        {
            key: "11",
            label: "Patient Report",
            children: [
                ...(isLabAssistant ? [
                    {
                        key: "11-1",
                        label: <Link to="/demo/lab">Lab Report</Link>,
                    },
                ] : []),
                {
                    key: "11-2",
                    label: <Link to="/demo/birth">Birth Report</Link>,
                },
                {
                    key: "11-3",
                    label: <Link to="/demo/death">Death Report</Link>,
                }
            ]
        },
        ...(isAdmin || isReceptionist
            ? [
                {
                    key: "5",
                    icon: <DollarCircleOutlined />,
                    label: "Finance",
                    children: [
                        {
                            key: "5-1",
                            icon: <AccountBookOutlined />,
                            label: <Link to="/demo/billing">Billing</Link>,
                        },
                        ...(isAdmin
                            ? [
                                {
                                    key: "5-2",
                                    icon: <WalletOutlined />,
                                    label: <Link to="/demo/finance">Finance</Link>,
                                },
                            ]
                            : []),
                        {
                            key: "5-3",
                            icon: <SnippetsOutlined />,
                            label: <Link to="/demo/invoice">Invoice</Link>,
                        }
                    ],
                },
            ]
            : []),
        ...(isAdmin || isPharmacist
            ? [
                {
                    key: "9",
                    label: "Pharmacy",
                    icon: <ShoppingOutlined />,
                    children: [
                        {
                            key: "9-1",
                            icon: <FileTextFilled />,
                            label: <Link to="/demo/pharmacy">Prescription</Link>,
                        },
                        {
                            key: "9-7",
                            label: <Link to="/demo/presInvoice">Prescription Invoice</Link>,
                        },
                        {
                            key: "9-6",
                            label: <Link to="/demo/newbill">New Bill</Link>,
                        },
                        {
                            key: "9-2",
                            icon: <SolutionOutlined />,
                            label: <Link to="/demo/supplier">Supplier Management</Link>,
                        },
                        {
                            key: "9-3",
                            icon: <DatabaseOutlined />,
                            label: <Link to="/demo/stockitems">Stock Items</Link>,
                        },
                        {
                            key: "9-4",
                            icon: <ExperimentOutlined />,
                            label: <Link to="/demo/medicine">Medicines</Link>,
                        },
                        {
                            key: "9-5",
                            icon: <BarChartOutlined />,
                            label: <Link to="/demo/report">Report Management</Link>,
                        }
                    ]
                },
            ]
            : []),

        ...(isAdmin
            ? [{
                key: "6",
                icon: <UsergroupAddOutlined />,
                label: <Link to="/demo/users">Users</Link>,
            }]
            : []),
        {
            key: "10",
            icon: <UserOutlined />,
            label: <Link to="/demo/profile">Profile</Link>,
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogout,
        },
    ];

    return (
        <Sider
            width={250}
            style={{
                overflowY: "auto",
                height: "100vh",
                left: 0,
                background: "#fff",
            }}>
            <div className="logo" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "20px",
                color: "black",
                height: "66px",
                fontSize: "18px",
                fontWeight: "bold",
            }}>
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
            </Menu>
        </Sider>
    )

};

export default DemoSidebar;