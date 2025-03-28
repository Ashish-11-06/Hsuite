import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Card, Typography, Button, Descriptions, Input, message, Avatar } from "antd";
import { EditOutlined, SaveOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { logout, updateProfile } from "../Redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";
import  User_img  from '../assets/user.jpg';

const { Content } = Layout;
const { Title, Text } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    email: user?.email || "",
    username: user?.username || "",
  });

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(updateProfile(profileData))
      .then(() => {
        message.success("Profile updated successfully!");
        setIsEditing(false);
      })
      .catch(() => message.error("Failed to update profile."));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout
      style={{
        padding: "40px",
        display: "flex",
        justifyContent: "left",
        alignItems: "left",
        minHeight: "80vh",
        backgroundColor: "#e2f0ff",
        // borderRadius:'10px'
      }}
    >
      <Content>
        <Title level={2} style={{ textAlign: "center", fontWeight: 700, color: "#333" ,paddingRight: "0px" }}>
          Profile
        </Title>

        {isAuthenticated && user ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "20px",
            }}
          >
            {/* User Avatar on Left Side */}
            <div style={{ textAlign: "center", paddingRight:"100px", marginLeft:"0px" }}>
              <Avatar
                size={250}
                src={user.image || User_img}
                icon={!user.image && <UserOutlined />}
                style={{ border: "2px solid #ddd" }}
              />
              <Text strong style={{ display: "block", marginTop: "10px", fontSize: "18px" }}>
                {profileData.username}
              </Text>
            </div>

            {/* Profile Card */}
            <Card
              style={{
                maxWidth: "450px",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Descriptions column={1} size="middle" labelStyle={{ fontWeight: "bold", width: "100px" }}>
                <Descriptions.Item label="Email">
                  {isEditing ? (
                    <Input name="email" value={profileData.email} onChange={handleChange} />
                  ) : (
                    profileData.email
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Username">
                  {isEditing ? (
                    <Input name="username" value={profileData.username} onChange={handleChange} />
                  ) : (
                    profileData.username
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Verified at">
                  {new Date(user.verified_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </Descriptions.Item>
              </Descriptions>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
                {/* <Button
                  type="default"
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                  style={{
                    backgroundColor: isEditing ? "#28A745" : "#1677ff",
                    color: "#fff",
                    fontWeight: "bold",
                    width: "48%",
                  }}
                >
                  {isEditing ? "Save" : "Edit"}
                </Button> */}

                <Button
                  type="primary"
                  danger
                  onClick={handleLogout}
                  icon={<LogoutOutlined />}
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    width: "48%",
                  }}
                >
                  Logout
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <Text style={{ textAlign: "center", fontSize: "16px", fontWeight: 500 }}>
            No user data available. Please log in.
          </Text>
        )}
      </Content>
    </Layout>
  );
};

export default Profile;
