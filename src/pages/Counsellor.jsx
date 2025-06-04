import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Typography, Row, Col, Spin, Alert, Avatar, Divider, Modal, Button, Empty } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  fetchAllCounsellors,
  fetchCounsellorById,
} from "../Redux/Slices/CounsellorSlice";
import RequestCounsellorModal from "../Modals/RequestCounsellorModal";
import { BASE_URL } from '../Redux/API/axiosInstance';

const { Title, Paragraph } = Typography;

const Counsellor = () => {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    counsellors,
    loading,
    error,
    selectedCounsellor,
  } = useSelector((state) => state.counsellor);

  useEffect(() => {
    dispatch(fetchAllCounsellors());
  }, [dispatch]);

  const handleCardClick = (id) => {
    setSelectedId(id);
    dispatch(fetchCounsellorById(id));
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

     const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Title level={2}>Available Counsellors</Title>
      
      <Button type="secondary" onClick={showModal}>Help ?</Button>
      
            <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}  // <-- This removes OK and Cancel buttons
        closable={true} // (default is true) shows the close (X) icon
      >
        <p>On this page, you can view all your ongoing and completed treatments. Each treatment will be shown based on its status—ongoing or completed. You can also download a PDF of the steps. These treatments appear after you choose a counsellor, send a request, and the counsellor adds steps for you. Once added, the steps will be displayed here so you can proceed with your treatment. After you send the request and the counsellor accepts it, they will be able to view all your test result reports.</p>
      </Modal>
      </div>

      {loading && !modalVisible && <Spin tip="Loading counsellors..." />}
      {error && !modalVisible && (
        <Alert message="Error" description={error} type="error" showIcon />
      )}

      {(counsellors || []).length === 0 && !loading && !error ? (
  <div style={{ textAlign: "center", marginTop: "40px", width: "100%" }}>
    <Empty description="No counsellors available" />
  </div>
) : (
  <Row gutter={[16, 16]}>
    {(counsellors || []).map((counsellor) => {
      const profile = counsellor.profile;
      return (
        <Col xs={24} sm={12} md={8} lg={6} key={counsellor.id}>
          <Card
            bordered
            hoverable
            onClick={() => handleCardClick(counsellor.id)}
            bodyStyle={{ textAlign: "center" }}
          >
            {profile && profile.photo ? (
              <Avatar
                size={120}
                src={
                  profile.photo.startsWith('http')
                    ? profile.photo
                    : `${BASE_URL}${profile.photo}`
                }
                alt={`${profile.first_name} ${profile.last_name}`}
                style={{ marginBottom: 12, objectFit: 'cover' }}
                icon={<UserOutlined />}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                }}
              />
            ) : (
              <Avatar size={120} icon={<UserOutlined />} style={{ marginBottom: 12 }} />
            )}
            <Divider style={{ margin: "12px 0" }} />
            <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 16 }}>
              {profile
                ? `${profile.first_name} ${profile.last_name}`
                : counsellor.username}
            </div>
            {profile ? (
              <>
                <Paragraph>
                  <strong>Qualification:</strong>{" "}
                  {profile.educational_qualifications || "N/A"}
                </Paragraph>
                <Paragraph>
                  <strong>Experience:</strong>{" "}
                  {profile.years_of_experience_months
                    ? `${profile.years_of_experience_months} months`
                    : "N/A"}
                </Paragraph>
                <Paragraph>
                  <strong>Current Position:</strong>{" "}
                  {profile.current_post || "N/A"}
                </Paragraph>
              </>
            ) : (
              <Paragraph type="secondary">
                Profile information not available
              </Paragraph>
            )}
          </Card>
        </Col>
      );
    })}
  </Row>
)}


      <RequestCounsellorModal
        visible={modalVisible}
        onClose={handleCloseModal}
        counsellor={selectedCounsellor}
        loading={loading && modalVisible}
        error={error && modalVisible ? error : null}
      />
    </div>
  );
};

export default Counsellor;
