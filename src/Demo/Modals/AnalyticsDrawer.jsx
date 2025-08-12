import React from "react";
import { Drawer, Descriptions } from "antd";

const AnalyticsDrawer = ({ visible, onClose }) => {
  return (
    <Drawer
      title="Summary Analytics"
      placement="right"
      width={400}
      onClose={onClose}
      open={visible}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Total Patients">320</Descriptions.Item>
        <Descriptions.Item label="Total Visits">970</Descriptions.Item>
        <Descriptions.Item label="New Patients This Week">47</Descriptions.Item>
        <Descriptions.Item label="Avg. Visits Per Day">65</Descriptions.Item>
        <Descriptions.Item label="Most Visited Department">Cardiology</Descriptions.Item>
        <Descriptions.Item label="Least Visited Department">Dermatology</Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default AnalyticsDrawer;
