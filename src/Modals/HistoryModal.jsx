import React, { useEffect } from "react";
import { Modal, List, Spin, Alert, Table, Typography, Card } from "antd";

const { Title,Text } = Typography;

const HistoryModal = ({ open, onClose, history }) => {
    useEffect(() => {
      //console.log("🔵 Rendering HistoryModal with data:", history);
    }, [history]);
  
    // Ensure history is defined and has the expected structure
    const mainHistory = history?.mainHistory || [];
    const subHistories = history?.subHistories || [];

      // Table columns for Main History
  const mainColumns = [
    { title: "Code", dataIndex: ["changes", "code"], key: "code" },
    { title: "Description", dataIndex: ["changes", "description"], key: "description" },
    { title: "Updated By", dataIndex: "updated_by", key: "updated_by" },
    { 
      title: "Updated At", 
      dataIndex: "updated_at", 
      key: "updated_at", 
      render: (date) => new Date(date).toLocaleString() 
    },
  ];

  // Table columns for Sub-description History
  const subColumns = [
    { title: "Code", dataIndex: ["changes", "code"], key: "code" },
    { title: "Sub-description", dataIndex: ["changes", "sub_description"], key: "sub_description" },
    { title: "Updated By", dataIndex: "updated_by", key: "updated_by" },
    { 
      title: "Updated At", 
      dataIndex: "updated_at", 
      key: "updated_at", 
      render: (date) => new Date(date).toLocaleString() 
    },
  ];
  
    return (
      <Modal 
      title="History" 
      open={open} 
      onCancel={onClose} 
      footer={null}  
      width={900}
      styles={{ body: { maxHeight: "60vh", overflowY: "auto" } }} >
        
        {mainHistory.length === 0 && subHistories.every(sub => sub.history.length === 0) ? (
          <Alert message="No history available" type="info" showIcon />
        ) : (
          <>
            {mainHistory.length > 0 && (
              <>
                <Title level={4} style={{ marginBottom: 10 }}>Main Code History</Title>
                {mainHistory.map((item, index) => (
                  <Card key={index} style={{ marginBottom: 10, borderLeft: "5px solid #1890ff" }}>
                  <Text strong style={{ fontSize: 16 }}>Code: {item.changes.code}</Text>
                  <p>Description: {item.changes.description}</p>

                  {/* 🔹 Flexbox for Side-by-Side layout */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <Text type="secondary">Updated by: {item.updated_by}</Text>
                    <Text type="secondary">Updated at: {new Date(item.updated_at).toLocaleString()}</Text>
                  </div>
                </Card>

              //     <Table
              //   dataSource={mainHistory}
              //   columns={mainColumns}
              //   rowKey={(record, index) => index}
              //   pagination={false}
              //   bordered
              //   size="small"
              // />
                ))}
              </>
            )}
  
            {subHistories.length > 0 && (
              <>
              <Title level={4} style={{ marginTop: 20 }}>Sub-description Histories</Title>
                {subHistories.map((sub, index) => (
                  <div key={index}>
                    <Title level={5} style={{ marginBottom: 5 }}>Sub-description: {sub.sub_description}</Title>
                    {sub.history.length > 0 ? (
                      sub.history.map((item, subIndex) => (
                        <Card key={subIndex} style={{ marginBottom: 10, borderLeft: "5px solid #fa541c" }}>
                        <Text strong style={{ fontSize: 16 }}>Code: {item.changes.code}</Text>
                        <p>Sub-description: {item.changes.sub_description}</p>

                        {/* 🔹 Flexbox for Side-by-Side layout */}
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                          <Text type="secondary">Updated by: {item.updated_by}</Text>
                          <Text type="secondary">Updated at: {new Date(item.updated_at).toLocaleString()}</Text>
                        </div>
                      </Card>
                      //   <Table
                      //   dataSource={sub.history}
                      //   columns={subColumns}
                      //   rowKey={(record, subIndex) => subIndex}
                      //   pagination={false}
                      //   bordered
                      //   size="small"
                      // />
                      ))
                    ) : (
                      <p>No history available for this sub-description.</p>
                    )}
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </Modal>
    );
  };
export default HistoryModal;