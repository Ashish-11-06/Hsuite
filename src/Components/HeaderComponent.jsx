import { Menu } from "antd";
import { HomeOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const HeaderComponent = () => {
  // Define the menu items using the `items` prop
  const items = [
   
  ];

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={["1"]}
      items={items} // Use the `items` prop
    />
  );
};

export default HeaderComponent;