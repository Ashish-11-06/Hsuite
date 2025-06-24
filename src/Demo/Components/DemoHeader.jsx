import React from "react";
import { Menu } from "antd";

const DemoHeader = () => {

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

        </h2>
      </div>
    </div>
  )

};

export default DemoHeader;