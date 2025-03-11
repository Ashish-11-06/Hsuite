import { Menu, Avatar, Badge, Space} from "antd";
import { UserOutlined, DashboardOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const HeaderComponent = () => {
  // Define the menu items using the `items` prop
  const items = [
   
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}
      items={items} // Use the `items` prop 
      style={{ flexGrow: 1 }} />

      <div style={{ marginLeft: "auto", paddingRight: "20px", color: "black", fontWeight: "bold", display: "flex", alignItems: "center" }}>
        <Link to="/profile" style={{  fontSize: "24px",  textDecoration: "none"  }}>
           {<UserOutlined style={{ fontSize: "28px" }}  />} 
          
        </Link>
      </div>
    </div>
  );
};

export default HeaderComponent;