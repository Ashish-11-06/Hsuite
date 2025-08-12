import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Row, Col, Spin } from "antd";
import { getCount } from "../Redux/Slices/PatientSlice";

import { CalendarOutlined, TeamOutlined, ExperimentOutlined, UserOutlined, MedicineBoxOutlined, PlusCircleOutlined, SolutionOutlined, UsergroupAddOutlined } from '@ant-design/icons';

const iconMap = {
  "TODAY'S OPD": <CalendarOutlined />,
  "TODAY'S IPD": <PlusCircleOutlined />,
  "TOTAL PATIENTS": <TeamOutlined />,
  "DOCTORS": <UserOutlined />,
  "NURSES": <SolutionOutlined />,
  "RECEPTIONISTS": <UsergroupAddOutlined />,
  "LAB ASSISTANTS": <ExperimentOutlined />,
  "PHARMACISTS": <MedicineBoxOutlined />,
  "TOTAL USERS": <TeamOutlined />,
};

const gradientMap = {
  "TODAY'S OPD": "linear-gradient(135deg, #f54ea2, #ff7676)",
  "TODAY'S IPD": "linear-gradient(135deg, #42e695, #3bb2b8)",
  "TOTAL PATIENTS": "linear-gradient(135deg, #f093fb, #f5576c)",
  "DOCTORS": "linear-gradient(135deg, #43e97b, #38f9d7)",
  "NURSES": "linear-gradient(135deg, #ff9a9e, #fad0c4)",
  "RECEPTIONISTS": "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  "LAB ASSISTANTS": "linear-gradient(135deg, #667eea, #764ba2)",
  "PHARMACISTS": "linear-gradient(135deg, #f6d365, #fda085)",
  "TOTAL USERS": "linear-gradient(135deg, #ffecd2, #fcb69f)",
};

const StatCard = ({ title, count }) => {
  const icon = iconMap[title] || <UserOutlined />;
  const bg = gradientMap[title] || "#ccc";

  return (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      padding: "16px 20px",
      minHeight: "100px",
    }}>
      {/* Icon */}
      <div
        style={{
          background: bg,
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "24px",
          marginRight: "16px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "4px" }}>{count}</div>
        <div style={{ fontSize: "14px", color: "#777", textTransform: "uppercase" }}>{title}</div>
      </div>
    </div>
  );
};


const Home = () => {
  const dispatch = useDispatch();
  const [countData, setCountData] = useState(null);
  const [loading, setLoading] = useState(true);

  const hmsUser = JSON.parse(localStorage.getItem("HMS-user"));
  const isAdmin = hmsUser?.designation === "admin";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resultAction = await dispatch(getCount());
        if (getCount.fulfilled.match(resultAction)) {
          setCountData(resultAction.payload);
        } else {
          // console.error("Failed to fetch count:", resultAction.payload);
        }
      } catch (err) {
        // console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading || !countData) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "100px auto" }}
      />
    );
  }

  return (
    <div className="dashboard-container" style={{ padding: "40px" }}>
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <StatCard title="TODAY'S OPD" count={countData.todays_opd_count} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard title="TODAY'S IPD" count={countData.todays_ipd_count} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard title="TOTAL PATIENTS" count={countData.total_patient_count} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard title="DOCTORS" count={countData.doctors_count} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard title="NURSES" count={countData.nurses_count} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard title="RECEPTIONISTS" count={countData.receptionist_count} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard title="LAB ASSISTANTS" count={countData.lab_assistant_count} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard title="PHARMACISTS" count={countData.pharmacist_count} />
        </Col>
        {isAdmin && (
          <Col xs={24} sm={12} md={8}>
            <StatCard
              title="TOTAL STAFF"
              count={
                countData.doctors_count +
                countData.nurses_count +
                countData.receptionist_count +
                countData.lab_assistant_count +
                countData.pharmacist_count
              }
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Home;
