import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssessmentHistory } from "../Redux/Slices/assessmentSlice";
import { Table, Card } from "antd";

export const Report = ({ userId }) => {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.assessments.history);
  const loading = useSelector((state) => state.assessments.loading);
  const error = useSelector((state) => state.assessments.error);

  userId=1;
  // Check if userId is defined
  if (!userId) {
    return <p>User ID is not available. Please log in.</p>;
  }

  useEffect(() => {
    if (userId) { // Only dispatch if userId is defined
      dispatch(fetchAssessmentHistory(userId));
    }
  }, [dispatch, userId]);

  console.log("History Data:", history)

  // Define columns for the table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Logical",
      dataIndex: "logical",
      key: "logical",
    },
    {
      title: "Analytical",
      dataIndex: "analytical",
      key: "analytical",
    },
    {
      title: "Strategic",
      dataIndex: "strategic",
      key: "strategic",
    },
    {
      title: "Thinking",
      dataIndex: "thinking",
      key: "thinking",
    },
    {
      title: "Skipped",
      dataIndex: "skip",
      key: "skip",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <Card title="Assessment History" style={{ margin: "20px" }}>
      {loading ? (
        <p>Loading history...</p>
      ) : (
        <Table
          dataSource={history || []}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }} // Add pagination
        />
      )}
    </Card>
  );
};