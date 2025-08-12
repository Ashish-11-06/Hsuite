import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchHospitalById } from "../Redux/Slices/PatientRegisterSlice";
import { useParams, Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, message } from "antd";

const PatientHeader = () => {
  const dispatch = useDispatch();
  const { hospitalId } = useParams();

  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getHospital = async () => {
      try {
        setLoading(true);
        const res = await dispatch(fetchHospitalById(hospitalId)).unwrap();
        setHospital(res.hospital);
      } catch (error) {
        message.error("Failed to load hospital");
      } finally {
        setLoading(false);
      }
    };

    if (hospitalId) {
      getHospital();
    }
  }, [dispatch, hospitalId]);

  return (
    <div
      style={{
        height: "60px",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderBottom: "1px solid #e8e8e8",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: "bold" }}>
        {loading ? "Loading..." : hospital?.name || "Hospital"}
      </div>

      <Link to={`/demo/${hospitalId}/patient/patientprofile`}>
        <Avatar
          size={40}
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1890ff", cursor: "pointer" }}
        />
      </Link>


    </div>
  );
};

export default PatientHeader;
