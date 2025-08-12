import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRequestsByCounsellorId,
  updateRequestStatus,
  fetchTherapyStepsByUserId,  // Make sure this thunk exists in your slice
} from '../Redux/Slices/CounsellorSlice';
import { Table, Typography, Spin, Button, Space, message, Tag, Modal } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import AddCounStepModal from '../Modals/AddCounStepModal';
import GetCounFeedbackModal from '../Modals/GetCounFeedbackModal';

const { Title } = Typography;

const Therapies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const counsellorId = useSelector((state) => state.auth.user?.id);

  //state
  const [stepModalVisible, setStepModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedFeedbackUserId, setSelectedFeedbackUserId] = useState(null);
  const [selectedTherapyId, setSelectedTherapyId] = useState(null);
  const [hasTherapyMap, setHasTherapyMap] = useState({});
     const [isModalVisible, setIsModalVisible] = useState(false);


  const {
    counsellorRequestsByCounsellorId,
    counsellorRequestsByCounsellorIdLoading,
    counsellorRequestsByCounsellorIdError,
    requestStatusUpdating,
  } = useSelector((state) => state.counsellor);

  useEffect(() => {
    if (counsellorId) {
      dispatch(fetchRequestsByCounsellorId(counsellorId));
    }
  }, [dispatch, counsellorId]);

    // Check for existing therapies when requests data changes
  useEffect(() => {
    const checkExistingTherapies = async () => {
      if (!counsellorRequestsByCounsellorId?.length) return;

      const newMap = {};
      const acceptedRequests = counsellorRequestsByCounsellorId.filter(
        req => req.status?.toLowerCase() === 'accepted'
      );

      for (const request of acceptedRequests) {
        try {
          const therapies = await dispatch(fetchTherapyStepsByUserId(request.user?.id)).unwrap();
          newMap[request.id] = therapies.some(t => t.request_id === request.id);
        } catch (error) {
          console.error('Error checking therapies:', error);
          newMap[request.id] = false;
        }
      }

      setHasTherapyMap(newMap);
    };

    checkExistingTherapies();
  }, [counsellorRequestsByCounsellorId, dispatch]);

  const handleStatusUpdate = (requestId, newStatus) => {
    dispatch(updateRequestStatus({ request_id: requestId, status: newStatus }))
      .unwrap()
      .then((res) => {
        message.success(res?.message || `Request ${newStatus} successfully.`);
      })
      .catch((err) => {
        const errorMsg = err?.messgae || err?.detail || "failed to update status";
        message.error(errorMsg);
      });
  };

  // New handler for "See Feedback" button
  const handleSeeFeedback = async (userId, requestId) => {
    try {
      const res = await dispatch(fetchTherapyStepsByUserId(userId)).unwrap();
      if (Array.isArray(res)) {
        const therapyRecord = res.find((item) => item.request_id === requestId);
        if (therapyRecord) {
          setSelectedTherapyId(therapyRecord.id);
          setSelectedFeedbackUserId(userId);
          setFeedbackModalVisible(true);
        } else {
          message.error('Therapy record not found for this request.');
        }
      } else {
        message.error('Failed to fetch therapy steps.');
      }
    } catch (error) {
      message.error('Error fetching therapy steps.');
    }
  };

  const columns = [
    {
      title: 'Sr no.',
      dataIndex: 'srno',
      key: 'srno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user) => user?.username || 'Anonymous',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const status = record.status?.toLowerCase();
         const hasTherapy = hasTherapyMap[record.id] || false;

        if (status === 'accepted') {
          return (
            <Space>
              <Button
                type="default"
                onClick={() => navigate(`/view-results/${record.user?.id}`)}
              >
                View Results
              </Button>
               <Button
                type="primary"
                onClick={() => {
                  setSelectedRequest({
                    requestId: record.id,
                    userId: record.user?.id,
                  });
                  setStepModalVisible(true);
                }}
                disabled={hasTherapy}
              >
                {hasTherapy ? 'Treatment Added' : 'Add treatment'}
              </Button>
              <Button
                onClick={() => handleSeeFeedback(record.user?.id, record.id)}
                disabled={!hasTherapy}
              >
                See Feedback
              </Button>
            </Space>
          );
        }

        return (
          <Space>
            <Button
              type="primary"
              disabled={status === 'rejected' || requestStatusUpdating}
              onClick={() => handleStatusUpdate(record.id, 'accepted')}
            >
              Accept
            </Button>
            <Button
              danger
              disabled={status === 'rejected' || requestStatusUpdating}
              onClick={() => handleStatusUpdate(record.id, 'rejected')}
            >
              Reject
            </Button>
          </Space>
        );
      },
    },
  ];

   const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
       <Title level={3}>Therapies</Title>
      <Button type="secondary" onClick={showModal}>Help ?</Button>

      <Modal
  // title="Help"
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={null}  // <-- This removes OK and Cancel buttons
  closable={true} // (default is true) shows the close (X) icon
>
  <p>On this page, you can see all the requests sent to you by users. You have the option to accept or reject them. If you accept a request, you will be able to view the user's results and reports, and you can assign steps to help improve their personality. If the user provides feedback on any step, you can view it under "See Feedback".</p>
</Modal>

    </div>
        {counsellorRequestsByCounsellorIdLoading ? (
          <Spin size="large" />
        ) : counsellorRequestsByCounsellorIdError ? (
          <p style={{ color: 'red' }}>{counsellorRequestsByCounsellorIdError}</p>
        ) : (
          <Table
            dataSource={counsellorRequestsByCounsellorId}
            columns={columns}
            rowKey="id"
          />
        )}
      </div>

      {stepModalVisible && selectedRequest && (
        <AddCounStepModal
          visible={stepModalVisible}
          onClose={() => {
            setStepModalVisible(false);
            setSelectedRequest(null);
             dispatch(fetchRequestsByCounsellorId(counsellorId));
          }}
          requestId={selectedRequest.requestId}
          userId={selectedRequest.userId}
        />
      )}

      {feedbackModalVisible && selectedFeedbackUserId && (
        <GetCounFeedbackModal
          visible={feedbackModalVisible}
          onClose={() => {
            setFeedbackModalVisible(false);
            setSelectedFeedbackUserId(null);
            setSelectedTherapyId(null);
          }}
          userId={selectedFeedbackUserId}
          therapyId={selectedTherapyId}
        />
      )}
    </>
  );
};

export default Therapies;
