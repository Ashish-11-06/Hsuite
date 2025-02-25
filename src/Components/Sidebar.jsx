import React from "react";
import { Menu, Layout } from "antd";
import {
  HomeOutlined,
  InfoCircleOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider>
      <div
        className="logo"
        style={{ textAlign: "center", padding: "16px", color: "black", height: "66px", borderBottom: "2px solid #f0f0f0" }}
      >
        My App
      </div>
      <Menu theme="" mode="inline" defaultSelectedKeys={["1"]}
       style={{ color: "#000" }} 
       >
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<InfoCircleOutlined />}>
          <Link to="/books">Books</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<InfoCircleOutlined/>}>
          <Link to="/codes">Codes</Link>
        </Menu.Item>
         {/*<Menu.Item key="4" icon={<SettingOutlined />}>
          <Link to="/settings">Settings</Link>
        </Menu.Item> */}
        <Menu.Item key="3">
          <Link to="/code">Code</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;