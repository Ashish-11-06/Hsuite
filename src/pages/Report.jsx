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
      onHeaderCell: () => ({
        style: { backgroundColor: "#d9f7be", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
      render: (_, __, index) => index + 1, // Serial Number
    },
    {
      title: "Type",
      key: "type",
      onHeaderCell: () => ({
        style: { backgroundColor: "#d9f7be", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
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
      onHeaderCell: () => ({
        style: { backgroundColor: "#d9f7be", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
    },
    {
      title: "Analytical",
      dataIndex: "analytical",
      key: "analytical",
      onHeaderCell: () => ({
        style: { backgroundColor: "#d9f7be", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
    },
    {
      title: "Strategic",
      dataIndex: "strategic",
      key: "strategic",
      onHeaderCell: () => ({
        style: { backgroundColor: "#d9f7be", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
    },
    {
      title: "Thinking",
      dataIndex: "thinking",
      key: "thinking",
      onHeaderCell: () => ({
        style: { backgroundColor: "#d9f7be", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
    },
    {
      title: "Skipped",
      dataIndex: "skip",
      key: "skip",
      onHeaderCell: () => ({
        style: { backgroundColor: "#d9f7be", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
    },
    {
      title: "Total",
      // dataIndex: "total",
      key: "total",
      onHeaderCell: () => ({
        style: { backgroundColor: "#d9f7be", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
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
      onHeaderCell: () => ({
        style: { backgroundColor: "#d9f7be", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
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
      onHeaderCell: () => ({
        style: { backgroundColor: "#d9f7be", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      onHeaderCell: () => ({
        style: { backgroundColor: "#d9f7be", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
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
          // pagination={{ pageSize: 10 }} // Add pagination
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}
        />
      )}

       {/* View Modal */}
       <Modal
       title={
        <Text strong style={{ fontSize: "18px", textAlign: "center" }}>
          Assessment Details ({isStatementBased ? "Statement Based" : "MCQ"})
        </Text>
      }
        open={isModalOpen}
        onCancel={handleCloseModal}
        width={500} 
        footer={null}
        styles={{ maxHeight: "80vh", overflow: "hidden" }}
      >
      {selectedRow && (
          <Card
            style={{
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
              // padding: "15px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <Text strong style={{ fontSize: "16px" }}>Test Type:</Text>{" "}
              <Tag color={selectedRow.type === "statement-based" ? "green" : "blue"}>
                {selectedRow.type === "statement-based" ? "Statement Based" : "MCQ"}
              </Tag>
            </div>

            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <Text strong style={{ fontSize: "16px" }}>User ID:</Text>{" "}
              <Text>{selectedRow.id}</Text>
            </div>

            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <Text strong style={{ fontSize: "16px" }}>Date:</Text>{" "}
              <Text>{new Date(selectedRow.created_at).toLocaleString()}</Text>
            </div>
          

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
           { title: "Category", dataIndex: "category", key: "category",  align: "center"  },
           { title: "Count", dataIndex: "count", key: "count",  align: "center"  },
         ]}
         pagination={false} // Disable pagination to avoid scrolling
         size="small" // Reduce row size for compact view
         bordered // Add table borders
         style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}
         components={{
          header: {
            cell: ({ children }) => (
              <th style={{ backgroundColor: "#004080", color: "white", textAlign: "center" }}>
                {children}
              </th>
            ),
          },
        }}

       />
       <div style={{ textAlign: "center", marginTop: "15px" }}>
       <Text strong style={{ fontSize: "16px" }}>Result: </Text>
         {selectedRow.result ? (
           <Tag color={resultColors[selectedRow.result] || "default"} style={{ fontSize: "14px", padding: "5px 10px" }}>
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