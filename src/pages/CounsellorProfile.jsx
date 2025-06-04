import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Descriptions, Button, Space, Avatar, Upload, message, Input } from "antd";
import { EditOutlined, SaveOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { fetchCounsellorById } from "../Redux/Slices/CounsellorSlice";
import { UpdateCounsellorProfile } from "../Redux/Slices/authSlice";
import User_img from '../assets/user.jpg';
import { BASE_URL } from '../Redux/API/axiosInstance';

const CounsellorProfile = ({ user }) => {
  const dispatch = useDispatch();
  const counsellorDetails = useSelector((state) => state.counsellor.selectedCounsellor);
  
  const [counsellorEdit, setCounsellorEdit] = useState(false);
  const [counsellorData, setCounsellorData] = useState({
    first_name: "",
    last_name: "",
    educational_qualifications: "",
    years_of_experience_months: "",
    current_post: "",
    photo: null,
  });

  const [counsellorImageUrl, setCounsellorImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

   useEffect(() => {
    if (user?.id) {
      dispatch(fetchCounsellorById(user.id));
    }
  }, [dispatch, user?.id]);

  // Load counsellor data when component mounts or when counsellorDetails changes
  useEffect(() => {
    if (counsellorDetails?.profile) {
      const { profile } = counsellorDetails;
      setCounsellorData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        educational_qualifications: profile.educational_qualifications || "",
        years_of_experience_months: profile.years_of_experience_months || "",
        current_post: profile.current_post || "",
        photo: null,
      });

      // Set counsellor image
      const counsellorPhotoUrl = profile.photo ? 
        (profile.photo.startsWith('http') ? profile.photo : `${BASE_URL}${profile.photo}`) : 
        null;
      setCounsellorImageUrl(counsellorPhotoUrl);
    }
  }, [counsellorDetails]);

  // Save Counsellor Profile
  const handleSaveCounsellorProfile = () => {
    const formData = new FormData();
    Object.entries(counsellorData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    dispatch(UpdateCounsellorProfile({
      id: user.id,
      data: formData
    }))
      .then((res) => {
        if (res.type.includes("fulfilled")) {
          message.success("Professional details updated successfully");
          dispatch(fetchCounsellorById(user.id));
          setCounsellorEdit(false);
        }
      });
  };

  // Handle Image Upload
  const beforeUpload = (file) => {
    const isValid = file.type.startsWith('image/') && file.size / 1024 / 1024 < 2;
    if (!isValid) message.error('Image must be JPEG/PNG and smaller than 2MB!');
    return isValid;
  };

  const handleCounsellorImageChange = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      setImageLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setCounsellorImageUrl(reader.result);
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
      setCounsellorData(prev => ({ ...prev, photo: file }));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "30px",
        marginTop: "20px",
      }}
    >
      {/* Left: Avatar */}
      <div style={{ textAlign: "center", minWidth: "250px" }}>
        <Avatar
          size={200}
          src={counsellorImageUrl || User_img}
          icon={<UserOutlined />}
          style={{ border: "2px solid #ddd", marginBottom: 16 }}
        />
        
        {counsellorEdit && (
          <Upload
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleCounsellorImageChange}
            accept="image/*"
            customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
          >
            <Button icon={<UploadOutlined />} loading={imageLoading} block>
              Change Photo
            </Button>
          </Upload>
        )}
      </div>

      {/* Right: Details Card */}
      <Card
        title="Professional Details"
        style={{ width: 450 }}
        actions={[
          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            {!counsellorEdit ? (
              <Button
              type="default"
               icon={<EditOutlined />} 
               onClick={() => setCounsellorEdit(true)}
               style={{marginLeft: 150}}>
                Edit
              </Button>
            ) : (
              <Space>
                <Button
                  icon={<SaveOutlined />}
                  onClick={handleSaveCounsellorProfile}
                  type="primary"
                  style={{marginLeft: 150}}
                >
                  Save
                </Button>
                <Button
                type="danger"
                  onClick={() => {
                    setCounsellorEdit(false);
                    if (counsellorDetails?.profile) {
                      setCounsellorData(counsellorDetails.profile);
                    }
                  }}
                >
                  Cancel
                </Button>
              </Space>
            )}
          </Space>,
        ]}
      >
        <Descriptions column={1}>
          <Descriptions.Item label="First Name">
            {counsellorEdit ? (
              <Input
                value={counsellorData.first_name}
                onChange={(e) =>
                  setCounsellorData({
                    ...counsellorData,
                    first_name: e.target.value,
                  })
                }
              />
            ) : (
              counsellorData.first_name
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Last Name">
            {counsellorEdit ? (
              <Input
                value={counsellorData.last_name}
                onChange={(e) =>
                  setCounsellorData({
                    ...counsellorData,
                    last_name: e.target.value,
                  })
                }
              />
            ) : (
              counsellorData.last_name
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Qualifications">
            {counsellorEdit ? (
              <Input
                value={counsellorData.educational_qualifications}
                onChange={(e) =>
                  setCounsellorData({
                    ...counsellorData,
                    educational_qualifications: e.target.value,
                  })
                }
              />
            ) : (
              counsellorData.educational_qualifications
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Experience">
            {counsellorEdit ? (
              <Input
                type="number"
                value={counsellorData.years_of_experience_months}
                onChange={(e) =>
                  setCounsellorData({
                    ...counsellorData,
                    years_of_experience_months: e.target.value,
                  })
                }
              />
            ) : (
              `${Math.floor(counsellorData.years_of_experience_months / 12)}y ${
                counsellorData.years_of_experience_months % 12
              }m`
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Current Post">
            {counsellorEdit ? (
              <Input
                value={counsellorData.current_post}
                onChange={(e) =>
                  setCounsellorData({
                    ...counsellorData,
                    current_post: e.target.value,
                  })
                }
              />
            ) : (
              counsellorData.current_post
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default CounsellorProfile;