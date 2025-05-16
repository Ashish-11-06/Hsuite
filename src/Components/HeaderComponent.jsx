import { Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const HeaderComponent = () => {
  const user = useSelector((state) => state.auth.user); // Get user data

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      {/* Centered Menu */}
      <div style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
        <Menu mode="horizontal" defaultSelectedKeys={["1"]} />
      </div>

      {/* Welcome Message + Profile Icon (Right-Aligned) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginLeft: "auto",
          paddingRight: "20px",
        }}
      >
        <h2
  style={{
    margin: 0,
    fontSize: "20px",
    whiteSpace: "nowrap",
    paddingRight: "20px",
  }}
>
  Welcome,{" "}
  <Link to="/profile" style={{ textDecoration: "none" }}>
    <span style={{ color: "blue" }}>{user?.username || "Guest"}</span>
  </Link>
</h2>

        <Link to="/profile">
          <UserOutlined style={{ fontSize: "28px" }} />
        </Link>
      </div>
    </div>
  );
};

export default HeaderComponent;
