import { Menu, Layout } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const DemoSidebar= () => {
const Sider= Layout
    return(
        <Sider>
            <div>
                Hsuite Demo
            </div>

            <Menu>
                <Menu.Item>
                    <Link to="/demohome">demo Home</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    )

};

export default DemoSidebar;