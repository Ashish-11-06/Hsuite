import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Card, Typography, Button, Descriptions, Input, message, Avatar, Form, Modal } from "antd";
import { EditOutlined, SaveOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { loginSuccess, logout } from "../Redux/Slices/authSlice";
import { updateProfile } from "../Redux/Slices/profileSlice";
import { useNavigate } from "react-router-dom";
import User_img from '../assets/user.jpg';
import { BASE_URL } from '../Redux/API/axiosInstance';
import CounsellorProfile from './CounsellorProfile';

const { Content } = Layout;
const { Title, Text } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isCounsellor = user?.role === 'Counsellor';

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    email: user?.email || "",
    username: user?.username || "",
  });

  const [userImageUrl, setUserImageUrl] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        email: user.email,
        username: user.username,
      });

      const userPhotoUrl = user.photo ?
        (user.photo.startsWith('http') ? user.photo : `${BASE_URL}${user.photo}`) :
        null;
      setUserImageUrl(userPhotoUrl);
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(updateProfile(profileData))
      .then((res) => {
        if (res.type.includes("fulfilled")) {
          const updatedUser = res.payload.user;
          setProfileData({
            email: updatedUser.email,
            username: updatedUser.username,
          });
          dispatch(loginSuccess(updatedUser));
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setIsEditing(false);
          message.success("Profile updated successfully");
        } else {
          message.error("Failed to update profile.");
        }
      });
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      content: "You will need to log in again to access your profile.",
      okText: "Logout",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        dispatch(logout());
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.clear();
        navigate("/login");
      },
    });
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
      }}
    >
      <Content>
        <Title level={2} style={{ textAlign: "center", fontWeight: 700, color: "#333", paddingRight: "0px" }}>
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
            {isCounsellor && (
              <div style={{ marginLeft: "20px" }}>
                <CounsellorProfile user={user} />
              </div>
            )}
            {/* User Avatar on Left Side */}
            {!isCounsellor && (
              <div style={{ textAlign: "center", paddingRight: "100px", marginLeft: "0px" }}>
                <Avatar
                  size={250}
                  src={userImageUrl || User_img}
                  icon={!userImageUrl && <UserOutlined />}
                  style={{ border: "2px solid #ddd" }}
                />
                <Text strong style={{ display: "block", marginTop: "10px", fontSize: "18px" }}>
                  {profileData.username}
                </Text>
              </div>
            )}

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
                    <Input name="email" value={profileData.email} onChange={handleChange} disabled />
                  ) : (
                    profileData.email
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Username" >
                  {isEditing ? (
                    <Form
                      layout="vertical"
                      onFinish={handleSave}
                      initialValues={{ username: profileData.username }}
                      onValuesChange={(changedValues, allValues) =>
                        setProfileData((prev) => ({ ...prev, ...allValues }))
                      }
                    >
                      <Form.Item
                        // label="Username"
                        name="username"
                        rules={[
                          { required: true, message: "Please enter a username" },
                          { min: 5, message: "Username must be at least 5 characters" },
                          {
                            pattern: /^[a-zA-Z0-9_]+$/,
                            message:
                              "Only letters, numbers, and underscores are allowed.",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        type="primary"
        htmlType="submit"
        icon={<SaveOutlined />}
        style={{ width: "48%" }}
      >
        Save
      </Button>

      <Button
        danger
        onClick={() => {
          setProfileData({
            email: user.email,
            username: user.username,
          });
          setIsEditing(false);
        }}
        style={{ width: "48%" }}
      >
        Cancel
      </Button>
    </div> */}
                    </Form>
                  ) : (
                    <Descriptions.Item label="Username">
                      {profileData.username}
                    </Descriptions.Item>
                  )}

                </Descriptions.Item>

                {user?.verified_at && (
                  <Descriptions.Item label="Verified at">
                    {new Date(user.verified_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </Descriptions.Item>
                )}
              </Descriptions>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
                <Button
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
                </Button>

                {isEditing ? (
                  <Button
                    type="default"
                    danger
                    onClick={() => {
                      setProfileData({
                        email: user.email,
                        username: user.username,
                      });
                      setIsEditing(false);
                    }}
                    style={{
                      fontWeight: "bold",
                      width: "48%",
                    }}
                  >
                    Cancel
                  </Button>
                ) : (
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
                )}
              </div>
            </Card>

            {/* Counsellor Profile Section */}

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

export default Profile;