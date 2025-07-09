import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "antd";
import { GetAllOPD } from "../Redux/Slices/OpdSlice";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";

const isToday = (someDate) => {
  const today = new Date();
  const date = new Date(someDate);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const StatCard = ({ title, todayCount, totalCount }) => {
  const showToday = todayCount !== null && todayCount !== undefined;

  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      overflow: "hidden",
      minHeight: "180px",
      width: "100%",
      maxWidth: "300px",
      margin: "auto",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        background: "#0077b6",
        padding: "12px",
        textAlign: "center",
        color: "white",
        fontWeight: 600,
        fontSize: "16px"
      }}>
        {title}
      </div>
      <div style={{
        flex: 1,
        padding: "20px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        {showToday && (
          <>
            <div style={{ color: "#7d7d7d", fontSize: "14px", marginBottom: "4px" }}>TODAY</div>
            <div style={{ color: "#0077b6", fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
              {todayCount}
            </div>
          </>
        )}
        {/* Keep spacing consistent even if TODAY is not shown */}
        {!showToday && <div style={{ height: "64px" }}></div>}

        <div style={{ color: "#7d7d7d", fontSize: "14px", marginBottom: "4px" }}>TOTAL</div>
        <div style={{ color: "#0077b6", fontSize: "28px", fontWeight: "bold" }}>{totalCount}</div>
      </div>
    </div>
  );
};


const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetAllOPD());
    dispatch(fetchAllPatients());
    dispatch(GetAllUsers());
  }, [dispatch]);

  const opdData = useSelector((state) => state.opd?.opdData?.data || []);
  const patients = useSelector((state) => state.patient?.allPatients || []);
  const users = useSelector((state) => state.users?.users || []);

  const todayOpds = opdData.filter((item) => isToday(item.date_time));
  const todayPatients = patients.filter((item) => isToday(item.created_at || item.date));

  const hmsUser = JSON.parse(localStorage.getItem("HMS-user"));
  const isAdmin = hmsUser?.designation === "admin";

  return (
    <div className="dashboard-container" style={{ padding: "40px" }}>
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <StatCard title="OPD" todayCount={todayOpds.length} totalCount={opdData.length} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard title="PATIENTS" todayCount={todayPatients.length} totalCount={patients.length} />
        </Col>
         {isAdmin && (
        <Col xs={24} sm={12} md={8}>
          <StatCard title="TOTAL USERS" todayCount={null} totalCount={users.length} />
        </Col>
         )}
      </Row>
    </div>
  );
};

export default Home;
