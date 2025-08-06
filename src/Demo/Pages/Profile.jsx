import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetHMSUserByIdAndHospital } from "../Redux/Slices/UsersSlice";
import { Spin, Card, Row, Col, Button } from "antd";
import AddDoctorProfileModal from "../Modals/AddDoctorProfileModal";
import { BASE_URL } from "../Redux/API/demoaxiosInstance";

const Profile = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const user = JSON.parse(localStorage.getItem("HMS-user"));
  const userId = user?.id;

  const { hmsUser, loading } = useSelector((state) => state.users);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          await dispatch(GetHMSUserByIdAndHospital(userId)).unwrap();
        }
      } catch (error) {
        // Error handling here if needed
      }
    };
    fetchUser();
  }, [dispatch, userId]);

  if (loading || !hmsUser){ return  (
  <Spin tip="Loading profile...">
    <div style={{height: 100}}></div>
  </Spin>);}

  const { hospital, hms_user, doctor_profile } = hmsUser;
  const isDoctor = hms_user?.designation?.toLowerCase() === "doctor";

  const openAddModal = () => {
    setIsEditMode(false);
    setShowModal(true);
  };

  const openEditModal = () => {
    setIsEditMode(true);
    setShowModal(true);
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Buttons */}
      <Row justify="end" style={{ marginBottom: "20px" }} gutter={10}>
        {isDoctor && !doctor_profile && (
          <Col>
            <Button type="primary" onClick={openAddModal}>
              Add Details
            </Button>
          </Col>
        )}
        {isDoctor && doctor_profile && (
          <Col>
            <Button onClick={openEditModal}>Edit Profile</Button>
          </Col>
        )}
      </Row>

      <Card variant="borderless">
        <Row gutter={0}>
          {/* Hospital Info */}
          <Col span={12}>
            <div
              style={{
                backgroundColor: "#0075abff",
                padding: "16px",
                borderRadius: "8px",
                color: "white",
              }}
            >
              <h2 style={{ marginBottom: "16px" }}>Hospital Information</h2>
              <p>
                <strong>Name:</strong> {hospital.name}
              </p>
              <p>
                <strong>Address:</strong> {hospital.address}
              </p>
              <p>
                <strong>Owner:</strong> {hospital.owner}
              </p>
              <p>
                <strong>Contact:</strong> {hospital.contact}
              </p>
            </div>
          </Col>

          {/* HMS User Info (shown for all users) */}
          <Col span={12}>
            <div style={{ padding: "16px" }}>
              <h2 style={{ marginBottom: "16px" }}>User Information</h2>

              {doctor_profile?.photo && isDoctor && (
                <img
                  src={`${BASE_URL}${doctor_profile.photo}`}
                  alt="Doctor"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    marginBottom: "16px",
                  }}
                />
              )}

              <p><strong>Name:</strong> {hms_user?.name}</p>
              <p><strong>Designation:</strong> {hms_user?.designation}</p>
              <p><strong>Email:</strong> {hms_user?.email}</p>


              {/* Doctor-only details */}
              {isDoctor && doctor_profile && (
                <>
                  <p><strong>Qualification:</strong> {doctor_profile?.qualification}</p>
                  <p><strong>Specialization:</strong> {doctor_profile?.specialization}</p>
                  <p><strong>Experience:</strong> {doctor_profile?.experience_years} years</p>
                  <p><strong>Gender:</strong> {doctor_profile?.gender || "—"}</p>
                  <p><strong>Date of Birth:</strong> {doctor_profile?.dob || "—"}</p>
                  <p><strong>Phone Number:</strong> {doctor_profile?.phone_number || "—"}</p>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Doctor Modal */}
      <AddDoctorProfileModal
        visible={showModal}
        setVisible={setShowModal}
        isEditMode={isEditMode}
        existingData={isEditMode ? doctor_profile : null}
        destroyOnClose
      />
    </div>
  );
};

export default Profile;
