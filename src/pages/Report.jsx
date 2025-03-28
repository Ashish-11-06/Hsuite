import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssessmentHistory } from "../Redux/Slices/assessmentSlice";
import { Table, Card, Button, Modal, Typography, Tabs, Tag } from "antd";

export const Report = ({ userId }) => {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.assessments.history);
  const loading = useSelector((state) => state.assessments.loading);
  const error = useSelector((state) => state.assessments.error);
  const statementOptions = useSelector((state) => state.assessments.statementOptions);

  const { Text } = Typography;
  const { TabPane } = Tabs;

  userId=1;

  // Check if userId is defined
  if (!userId) {
    return <p>User ID is not available. Please log in.</p>;
  }

   // State for modal visibility and selected row data
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedRow, setSelectedRow] = useState(null);
   const [activeTab, setActiveTab] = useState("all");
   const [isStatementBased, setIsStatementBased] = useState(false);

  useEffect(() => {
    if (userId) { // Only dispatch if userId is defined
      dispatch(fetchAssessmentHistory(userId));
    }
  }, [dispatch, userId]);

  // console.log("History Data:", history)

   // Function to handle view button click
   const handleView = (record) => {
    setSelectedRow(record);
    setIsStatementBased(record.total === 'statement-based');
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const getTestType = (record) => {
    return record.total === 2 ? 'statement' : "mcq";
  }

  const resultColors = {
    strategic: "orange",
    thinking: "blue",
    logical: "purple",
    analytical: "red",
  };

  // Define columns for the table
  const columns = [
    {
      title: "S.No.",
      key: "sno",
      render: (_, __, index) => index + 1, // Serial Number
    },
    {
      title: "Type",
      key: "type",
      render: (_, record) => (
        <Tag color={record.type === 'statement-based' ? 'green' : 'blue'}>
        {record.type === 'statement-based' ? 'Statement Based' : 'MCQ'}
      </Tag>
      ),
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
      // dataIndex: "total",
      key: "total",
      render: (_, record) => 
        (record.logical || 0) + 
        (record.analytical || 0) + 
        (record.strategic || 0) + 
        (record.thinking || 0) + 
        (record.skip || 0)
    },
    {
      title: "Result",
      key: "result",
      render: (_, record) => {
        return record.result ? (
          <Tag color={resultColors[record.result] || "default"}>{record.result}</Tag>
        ) : (
          <Text type="secondary">-</Text>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleView(record)}>
          View Details
        </Button>
      ),
    },
  ];

  const filteredData = history?.filter(record => {
    if (activeTab === 'all') return true;
    return activeTab === 'mcq' 
      ? record.type === 'mcq' 
      : record.type === 'statement-based';
  });

  return (
    <Card title="Assessment History" style={{ margin: "20px" }}>
       <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="All" key="all" />
        <TabPane tab="Multiple Choice" key="mcq" />
        <TabPane tab="Statement Based" key="statement" />
      </Tabs>
      {loading ? (
        <p>Loading history...</p>
      ) : (
        <Table
        dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }} // Add pagination
        />
      )}

       {/* View Modal */}
       <Modal
        title={`Assessment Details (${isStatementBased ? 'Statement Based' : 'MCQ'})`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedRow && (
           <Card style={{ borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
             <p style={{ textAlign: "center", fontSize: "16px", marginBottom: "15px" }}>
        <Text strong>Test Type:</Text> {selectedRow.type === 'statement-based' ? 'Statement Based' : 'MCQ'}
      </p>
             <p style={{ textAlign: "center", fontSize: "16px", marginBottom: "15px" }}>
            <Text strong>User ID:</Text> {selectedRow.id}
          </p>
          <p style={{ textAlign: "center", fontSize: "16px", marginBottom: "15px" }}>
            <Text strong>Date:</Text>  {new Date(selectedRow.created_at).toLocaleString()}
          </p>

         <Table
         dataSource={[
          //  { category: "ID", count: selectedRow.id },
           { category: "Logical", count: selectedRow.logical },
           { category: "Analytical", count: selectedRow.analytical },
           { category: "Strategic", count: selectedRow.strategic },
           { category: "Thinking", count: selectedRow.thinking },
           { category: "Skipped", count: selectedRow.skip },
           { category: "Total", count: 
                                      (selectedRow.logical || 0) + 
                                      (selectedRow.analytical || 0) + 
                                      (selectedRow.strategic || 0) + 
                                      (selectedRow.thinking || 0) + 
                                      (selectedRow.skip || 0)  },
          //  { category: "Date", count: new Date(selectedRow.created_at).toLocaleString() },
         ]}
         columns={[
           { title: "Category", dataIndex: "category", key: "category" },
           { title: "Count", dataIndex: "count", key: "count" },
         ]}
         pagination={false} // Disable pagination to avoid scrolling
         size="small" // Reduce row size for compact view
         bordered // Add table borders
       />
       <div style={{ textAlign: "center", marginTop: "15px" }}>
         <Text strong>Result: </Text>
         {selectedRow.result ? (
           <Tag color={resultColors[selectedRow.result] || "default"}>
           {selectedRow.result}
         </Tag>
         ) : (
           <Text type="secondary">No result calculated</Text>
         )}
       </div>
       </Card>
       
        )}
      </Modal>
    </Card>
  );
};