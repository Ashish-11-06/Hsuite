import React from "react";
import { Menu, Layout, Divider, Popconfirm } from "antd";
import {
  HomeOutlined,
  InfoCircleOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BookOutlined,
  AuditOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Slices/authSlice";

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("role"); // "Student", "Reviewer", "Contributor", "Admin"

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getSelectedKey = () => {
    if (location.pathname === "/") return "1";
    if (location.pathname.startsWith("/books")) return "2";
    if (location.pathname.startsWith("/codes")) return "3";
    if (location.pathname.startsWith("/profile")) return "4";
    if (location.pathname.startsWith("/users")) return "5";

    if (location.pathname.startsWith("/assessment")) return "6";

    if (location.pathname.startsWith("/createset")) return "6";
    if (location.pathname.startsWith("/assessents")) return "6";
    if (location.pathname.startsWith("/report")) return "6";
    if (location.pathname.startsWith("/createmcq")) return "6";
    if (location.pathname.startsWith("/mcqtest")) return "6";
    if (location.pathname.startsWith("/mcqreport")) return "6";
    if (location.pathname.startsWith("/createegogram")) return "6";
    if (location.pathname.startsWith("/testegogram")) return "6";
    if (location.pathname.startsWith("/egogramreport")) return "6";
    return "1";
  };

  return (
    <Sider>
      <div className="logo" style={{ textAlign: "center", padding: "20px", color: "black", height: "66px", fontSize: "18px", fontWeight: "bold", alignItems: "center", justifyContent: "center" }}>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          Medical Coding
        </Link>
      </div>

      <Menu
        theme=""
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{ color: "#000", flexGrow: 1, fontWeight: 500, paddingTop: 10 }}
      >
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<BookOutlined />}>
          <Link to="/books">Books</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<InfoCircleOutlined />}>
          <Link to="/codes">Codes</Link>
        </Menu.Item>

        {/* Personality Test SubMenu */}
        {/* <SubMenu key="6" icon={<AuditOutlined />} title="Personality Test">
          {userRole === "Admin" && (
            <Menu.Item key="6-1" icon={<CheckCircleOutlined />}>
              <Link to="/createset">Create Set</Link>
            </Menu.Item>
          )}
          <Menu.Item key="6-2" icon={<CheckCircleOutlined />}>
            <Link to="/assessents">Test</Link>
          </Menu.Item>
          <Menu.Item key="6-3" icon={<BarChartOutlined />}>
            <Link to="/report">Report</Link>
          </Menu.Item>
        </SubMenu>

        
        <SubMenu key="7" icon={<AuditOutlined />} title="Assessments">
          {userRole === "Admin" && (
            <Menu.Item key="7-1" icon={<CheckCircleOutlined />}>
              <Link to="/createmcq">Create MCQ</Link>
            </Menu.Item>
          )}
          <Menu.Item key="7-2" icon={<CheckCircleOutlined />}>
            <Link to="/mcqtest">MCQ Test</Link>
          </Menu.Item>
          <Menu.Item key="7-3" icon={<BarChartOutlined />}>
            <Link to="/mcqreport">MCQ Report</Link>
          </Menu.Item>
        </SubMenu> */}

        <Menu.Item key="6" icon={<AuditOutlined />}>
          <Link to="/assessment">Assessments</Link>
        </Menu.Item>


        {userRole === "Admin" && (
          <Menu.Item key="5" icon={<InfoCircleOutlined />}>
            <Link to="/users">Users</Link>
          </Menu.Item>
        )}

        <Menu.Item key="4" icon={<UserOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>
      </Menu>

      {isAuthenticated && (
        <Menu
          theme=""
          mode="inline"
          style={{ position: "absolute", bottom: "0", color: "#000", flexGrow: 1, fontWeight: 500, paddingTop: 10 }}
        >
          <Popconfirm
            title="Are you sure you want to logout?"
            onConfirm={handleLogout}
            okText="Yes"
            cancelText="No"
          >
            <Menu.Item key="logout" icon={<LogoutOutlined />} style={{paddingLeft:25}}>
              Logout
            </Menu.Item>
          </Popconfirm>
        </Menu>
      )}
    </Sider>
  );
};

export default Sidebar;