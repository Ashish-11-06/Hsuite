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
  CodeOutlined,
  TeamOutlined,
  IdcardOutlined,
  SolutionOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined  ,
  ContainerOutlined,
  RobotOutlined,
HeartOutlined
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
  if (
    location.pathname.startsWith("/assessment") ||
    location.pathname.startsWith("/createset") ||
    location.pathname.startsWith("/assessents") ||
    location.pathname.startsWith("/report") ||
    location.pathname.startsWith("/createmcq") ||
    location.pathname.startsWith("/mcqtest") ||
    location.pathname.startsWith("/mcqreport") ||
    location.pathname.startsWith("/createegogram") ||
    location.pathname.startsWith("/testegogram") ||
    location.pathname.startsWith("/egogramreport")
  ) {
    return "6";
  }
  if (location.pathname.startsWith("/automation")) return "7";
  if (location.pathname.startsWith("/clinical")) return "8";
  if (location.pathname.startsWith("/work")) return "9";
  if (location.pathname.startsWith("/treatment")) return "10";
  if (location.pathname.startsWith("/counsellortreatment")) return "11";
  if (
    location.pathname.startsWith("/therapy") ||
    location.pathname.startsWith("/viewresult") // Add this condition
  ) {
    return "12"; // This should match your Therapies menu item key
  }
  if (location.pathname.startsWith("/ongocountreatment")) return "13";
  if (location.pathname.startsWith("/counsellor")) return "14";
  return "1";
};


  return (
    <Sider>
      <div className="logo" style={{ textAlign: "center", padding: "20px", color: "black", height: "66px", fontSize: "18px", fontWeight: "bold", alignItems: "center", justifyContent: "center" }}>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          HSuite
        </Link>
      </div>

      <Menu
        theme=""
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{ color: "#000", flexGrow: 1, fontWeight: 500, paddingTop: 10 }}
      >
        <Menu.Item key="1" icon={<HomeOutlined />} title="Home">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<BookOutlined />} title="Books">
          <Link to="/books">Books</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<CodeOutlined />} title="Codes">
          <Link to="/codes">Codes</Link>
        </Menu.Item>

        <Menu.Item key="6" icon={<AuditOutlined />} title="Assessments">
          <Link to="/assessment">Assessments</Link>
        </Menu.Item>

       {userRole === "Counsellor" && (
        <Menu.Item key="12" icon={<HeartOutlined />} title="Therapies">
          <Link to="/therapy">Therapies</Link>
        </Menu.Item>
       )}

        <SubMenu key="treatmentMenu" icon={<SafetyCertificateOutlined />} title="Treatment">
          <Menu.Item key="10" icon = {<ContainerOutlined />} title="Predefined Treatment">
            <Link to="/treatment">Predefined Treatment</Link>
          </Menu.Item>
           <Menu.Item key="14" icon={<IdcardOutlined />} title="Counsellors">
            <Link to="/counsellor" >Counsellors</Link>
          </Menu.Item>
          <Menu.Item key="11" icon={<MedicineBoxOutlined />} title="Counsellor Treatment">
            <Link to="/counsellortreatment">Counsellor Treatment</Link>
          </Menu.Item>
          <Menu.Item key="13" icon={<ClockCircleOutlined />} title="Ongoing Counsellor Treatment">
            <Link to="/ongocountreatment">Ongoing Counsellor Treatment</Link>
          </Menu.Item>
        </SubMenu>

       {userRole === "Admin" && (
         <Menu.Item key="7" icon={<RobotOutlined />} title="Coding Automation">
          <Link to="/automation">Coding Automation</Link>
        </Menu.Item>
       )}

        <Menu.Item key="8" icon={<AuditOutlined />}>
          <Link to="/clinical">Clinical Notes</Link>
        </Menu.Item>

        
        <Menu.Item key="9" icon={<AuditOutlined />}>
          <Link to="/work">Work Organisation</Link>
        </Menu.Item>


        {userRole === "Admin" && (
          <Menu.Item key="5" icon={<TeamOutlined />}>
            <Link to="/users">Users</Link>
          </Menu.Item>
        )}

        <Menu.Item key="4" icon={<UserOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>
      </Menu>

      {/* {isAuthenticated && (
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
      )} */}
    </Sider>
  );
};

export default Sidebar;