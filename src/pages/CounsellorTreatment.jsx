import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Alert, Button, Tag, Modal } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCounsellorRequestsByUserId,
  fetchAllCounsellors,
} from "../Redux/Slices/CounsellorSlice";
import CounsellorStepsTestModal from "../Modals/CounsellorStepsTestModal";

const { Title } = Typography;

const CounsellorTreatment = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
     const [isModalmVisible, setIsmModalVisible] = useState(false);

  const userId = useSelector((state) => state.auth.user?.id);

  const {
    counsellorRequests,
    requestListLoading,
    requestListError,
    counsellors,
    counsellorsLoading,
    counsellorsError,
  } = useSelector((state) => state.counsellor);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCounsellorRequestsByUserId(userId));
      dispatch(fetchAllCounsellors());
    }
  }, [dispatch, userId]);

  const getCounsellorFullName = (counsellorId) => {
    if (!Array.isArray(counsellors)) return "Unknown";
    const counsellor = counsellors.find((c) => c.id === counsellorId);
    if (counsellor?.profile) {
      return `${counsellor.profile.first_name} ${counsellor.profile.last_name}`;
    }
    return "Unknown";
  };

  const handleSteps = (record) => {
    setSelectedRequestId(record.id); // set therapy request ID
    setIsModalVisible(true);         // open modal
  };

  const columns = [
    {
      title: "S.No",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Counsellor Name",
      key: "counsellorName",
      render: (_, record) => getCounsellorFullName(record.counsellor),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
      const lower = status?.toLowerCase();
      switch (lower) {
        case 'accepted':
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Accepted
            </Tag>
          );
        case 'rejected':
          return (
            <Tag icon={<CloseCircleOutlined />} color="error">
              Rejected
            </Tag>
          );
        default:
          return (
            <Tag icon={<ClockCircleOutlined />} color="warning">
              Pending
            </Tag>
          );
      }
    },
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Button onClick={() => handleSteps(record)}>Steps</Button>
    //   ),
    // },
  ];

  if (requestListLoading || counsellorsLoading) return <Spin tip="Loading..." />;
  if (requestListError) return <Alert type="error" message={requestListError} />;
  if (counsellorsError) return <Alert type="error" message={counsellorsError} />;

   const showModal = () => {
    setIsmModalVisible(true);
  };
  const handleCancel = () => {
    setIsmModalVisible(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Title level={3}>My Therapy Requests</Title>
      <Button type="secondary" onClick={showModal}>Help ?</Button>

      <Modal
  // title="Help"
  visible={isModalmVisible}
  onCancel={handleCancel}
  footer={null}  // <-- This removes OK and Cancel buttons
  closable={true} // (default is true) shows the close (X) icon
>
  <p>On this page, you can see the requests you have sent to any counsellor. After taking the test and choosing counsellor treatments, you select a counsellor and send them a request. The status of your request—accepted, rejected, or pending—will be shown here. If the request is accepted and the counsellor has added steps for you, they will appear in the "Ongoing Counsellor Treatment" section in the sidebar.</p>
</Modal>

    </div>
      
      <Table
        dataSource={counsellorRequests}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
      />
      <CounsellorStepsTestModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        userId={userId}
        requestId={selectedRequestId}
      />
    </div>
  );
};

export default CounsellorTreatment;
