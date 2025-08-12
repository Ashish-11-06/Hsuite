import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Avatar, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchCounsellorById } from "../Redux/Slices/CounsellorSlice";
import { BASE_URL } from "../Redux/API/axiosInstance";
import User_img from "../assets/user.jpg";

const GetDetailsCounsellorModal = ({ open, onClose, counsellor }) => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(null);

  const counsellorDetails = useSelector(
    (state) => state.counsellor.selectedCounsellor
  );

  useEffect(() => {
    if (counsellor?.id) {
      dispatch(fetchCounsellorById(counsellor.id));
    }
  }, [dispatch, counsellor?.id]);

  useEffect(() => {
    if (counsellorDetails?.profile?.photo) {
      const photoUrl = counsellorDetails.profile.photo;
      setImageUrl(photoUrl.startsWith("http") ? photoUrl : `${BASE_URL}${photoUrl}`);
    }
  }, [counsellorDetails]);

  if (!counsellor) return null;

  return (
    <Modal
      title={`Counsellor Details - ${counsellor.username}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Avatar
          size={120}
          src={imageUrl || User_img}
          icon={<UserOutlined />}
          style={{ border: "2px solid #ddd" }}
        />
      </div>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Username">{counsellor.username}</Descriptions.Item>
        <Descriptions.Item label="Email">{counsellor.email}</Descriptions.Item>
        <Descriptions.Item label="Role">{counsellor.role}</Descriptions.Item>
        <Descriptions.Item label="Status">
          {counsellor.is_active === false ? "Disabled" : "Active"}
        </Descriptions.Item>

        {counsellorDetails?.profile && (
          <>
            <Descriptions.Item label="First Name">{counsellorDetails.profile.first_name || "-"}</Descriptions.Item>
            <Descriptions.Item label="Last Name">{counsellorDetails.profile.last_name || "-"}</Descriptions.Item>
            <Descriptions.Item label="Qualifications">{counsellorDetails.profile.educational_qualifications || "-"}</Descriptions.Item>
            <Descriptions.Item label="Experience">
              {counsellorDetails.profile.years_of_experience_months
                ? `${Math.floor(counsellorDetails.profile.years_of_experience_months / 12)}y ${counsellorDetails.profile.years_of_experience_months % 12}m`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Current Post">{counsellorDetails.profile.current_post || "-"}</Descriptions.Item>
          </>
        )}
      </Descriptions>
    </Modal>
  );
};

export default GetDetailsCounsellorModal;
