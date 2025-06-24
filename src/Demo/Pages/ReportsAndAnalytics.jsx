import React, { useState } from "react";
import { Card, Tabs, DatePicker, Button, Space } from "antd";
import {
  Bar,
  Pie,
  Line,
  Column,
} from "@ant-design/plots";
import ReportsFilterModal from "../Modals/ReportsFilterModal";
import AnalyticsDrawer from "../Modals/AnalyticsDrawer";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ReportsAndAnalytics = () => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  // Sample chart data
  const visitsByDept = [
    { type: "General", value: 120 },
    { type: "Cardiology", value: 80 },
    { type: "Dermatology", value: 50 },
    { type: "ENT", value: 70 },
    { type: "Orthopedics", value: 60 },
  ];

  const genderDist = [
    { type: "Male", value: 140 },
    { type: "Female", value: 180 },
  ];

  const visitTrends = [
    { date: "2025-06-01", count: 45 },
    { date: "2025-06-02", count: 62 },
    { date: "2025-06-03", count: 58 },
    { date: "2025-06-04", count: 79 },
    { date: "2025-06-05", count: 91 },
  ];

  const barConfig = {
    data: visitsByDept,
    xField: "value",
    yField: "type",
    seriesField: "type",
    legend: false,
  };

  const pieConfig = {
    data: genderDist,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} ({percentage})",
    },
  };

  const lineConfig = {
    data: visitTrends,
    xField: "date",
    yField: "count",
    point: {
      size: 5,
      shape: "diamond",
    },
    smooth: true,
  };

  return (
    <div style={{ padding: 24 }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="OPD Reports" key="1">
          <Space style={{ marginBottom: 16 }}>
            <RangePicker />
            <Button onClick={() => setIsFilterModalVisible(true)}>
              More Filters
            </Button>
            <Button type="primary" onClick={() => setIsDrawerVisible(true)}>
              View Summary
            </Button>
          </Space>
          <Card title="Visits by Department">
            <Bar {...barConfig} />
          </Card>
          <Card title="Gender Distribution" style={{ marginTop: 16 }}>
            <Pie {...pieConfig} />
          </Card>
          <Card title="Visit Trends (Last 5 Days)" style={{ marginTop: 16 }}>
            <Line {...lineConfig} />
          </Card>
        </TabPane>
      </Tabs>

      <ReportsFilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
      />

      <AnalyticsDrawer
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />
    </div>
  );
};

export default ReportsAndAnalytics;
