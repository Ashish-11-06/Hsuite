import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Card, Typography, Button, Descriptions, Input, message } from "antd";
import { EditOutlined, SaveOutlined, LogoutOutlined } from "@ant-design/icons";
import { logout, updateProfile } from "../Redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";

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

  // Handle input changes
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleSave = () => {
    dispatch(updateProfile(profileData))
      .then(() => {
        message.success("Profile updated successfully!");
        setIsEditing(false); // Exit edit mode
      })
      .catch(() => message.error("Failed to update profile."));
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout
      style={{
        padding: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Content>
        <Title level={2} style={{ textAlign: "center", fontWeight: 700, color: "#333" }}>
          Profile
        </Title>
        {isAuthenticated && user ? (
          <Card
            style={{
              maxWidth: "400px",
              marginTop: "10px",
              padding: "1px",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* User Details */}
            <Descriptions column={1} size="middle" labelStyle={{ fontWeight: "bold", width: "100px" }}>
              {/* <Descriptions.Item label="User ID">{user.id}</Descriptions.Item> */}
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

            {/* Buttons Row */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
              {/* <Button
                type="default"
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                style={{
                  backgroundColor: isEditing ? "#28A745" : "#ff9f00",
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
        ) : (
          <Text style={{ textAlign: "center", fontSize: "16px", fontWeight: 500 }}>
            No user data available. Please log in.
          </Text>
        )}
      </Content>
    </Layout>
  );
};

export default Profile;
