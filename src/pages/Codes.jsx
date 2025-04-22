import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Spin, Alert, Space, Popconfirm, message, Input, Select } from "antd";
import { fetchCodes, deleteCode, editCode, fetchBooks, addReaction, clearReactionMessage, setUserReaction } from "../Redux/Slices/codeSlice";
import AddCodeModal from "../Modals/AddCodeModal";
import EditCodeModal from "../Modals/EditCodeModal"; // Import the EditCodeModal
import HistoryModal from "../Modals/HistoryModal";
import {EditOutlined, DeleteOutlined, HistoryOutlined, LikeOutlined, DislikeOutlined, DislikeTwoTone, LikeTwoTone, DislikeFilled, LikeFilled } from "@ant-design/icons";

const Codes = () => {
  const dispatch = useDispatch();
  const { codes, status, error, books, userReactions } = useSelector((state) => state.codes); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit modal
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);
  const [selectedCode, setSelectedCode] = useState(null); // Store selected code for editing
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search term state
  const [selectedBook, setSelectedBook] = useState(null); // Track selected book
    const [codeSearchTerm, setCodeSearchTerm] = useState(null); // 🔍 Search term for code
    const [globalSearch, setGlobalSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const userRole = currentUser?.role; // Get user role

const handleViewHistory = async (code) => {
  if (!code || !code.id) {
    message.error("Invalid code");
    return;
  }
  try {
    const mainHistory = code.history || [];
    const subHistories = await Promise.all(
      code.sub_descriptions.map(async (sub) => {
        return {
          code: sub.code,
          sub_description: sub.sub_description,
          history: sub.history || [],
        };
      })
    );
    const combinedHistory = {
      mainHistory,
      subHistories,
    };

    setHistoryData(combinedHistory); // Set the combined history data
    setIsHistoryModalOpen(true); // Open the modal to show the history
  } catch (error) {
   // console.error("Error fetching history:", error);
    message.error("Failed to fetch history");
  }
};

  const showModal = () => setIsModalOpen(true);

  const showEditModal = (code) => {
    setSelectedCode(code); // Set selected code
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteCode(id))
        .unwrap()
        .then(() => {
          message.success("Code deleted successfully!");
          dispatch(fetchCodes());
        })
        .catch(() => message.error("Failed to delete code"));
    } else {
      message.error("Invalid code id");
    }
  };

  const handleEdit = (updatedData) => {
   // console.log("Updated data to be sent:", updatedData);

    dispatch(editCode(updatedData))
      .unwrap()
      .then(() => {
        //console.log("✅ Server Response:", response);  // Debug server response
        message.success("Code updated successfully!");
        //console.log("Updated successfully");

        dispatch(fetchCodes()); // ✅ No useSelector inside here
        setRefresh((prev) => !prev); // 🔄 Force component to re-render

        setIsEditModalOpen(false);
        setSelectedCode(null);
      })
      .catch((error) => {
       // console.error("Failed to update code", error);
        message.error("Failed to update code");
      });
  };

  // Filtering logic with three search bars
  const filteredCodes = Array.isArray(codes) ? codes.filter((code) => {
    const bookName = code.book?.name || "Unknown Book"; 
    const mainCode = code.code || ""; 
    const description = code.description || ""; 
  
    const subDescriptions = (code.sub_descriptions || [])
      .map(sub => `${sub.code} ${sub.sub_description}`)
      .join(" ");
  
    // Global search across all fields
    const globalMatch = [bookName, mainCode, description, subDescriptions]
      .join(" ")
      .toLowerCase()
      .includes(globalSearch.toLowerCase());
  
    // Book and Code dropdown filter
    const bookMatch = !selectedBook || bookName === selectedBook;
    const codeMatch = !codeSearchTerm || mainCode === codeSearchTerm;
  
    return globalMatch && bookMatch && codeMatch;
  }) : [];

  // ✅ Handle Like/Dislike Click
  const handleReaction = (description_id, action) => {
    const user_id = currentUser?.id;
    
    if (!user_id) {
      message.error("User not found. Please log in.");
      return;
    }
  
    dispatch(setUserReaction({ 
      descriptionId: description_id, 
      action,
      liked: action === 'like',
      disliked: action === 'dislike'
    }));
  
    const reactionData = { user_id, description_id, action };
  
    dispatch(addReaction(reactionData))
      .unwrap()
      .then((response) => {
        if (response.message) {
          message.success(response.message);
        }
  
        // ✅ Re-fetch all codes to get updated counts
        // dispatch(fetchCodes());
  
        // Update specific reaction state
        dispatch(setUserReaction({
          descriptionId: description_id,
          action,
          liked: response.liked,
          disliked: response.disliked,
          likeCount: response.like_count,
          dislikeCount: response.dislike_count
        }));
      })
      .catch((error) => {
        console.error("Failed to react:", error);
        message.error("Failed to react to code");
  
        dispatch(setUserReaction({ descriptionId: description_id, action: null }));
      });
  };
  
  const columns = [
    {
      title: "Sr. No",
      dataIndex: "srNo",  // This will represent the serial number
      key: "srNo",
      render: (_, record, index) => index + 1,  // Serial number starts from 1
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#00EAFF",
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
      width: 80,
    },
    {
      title: (
        <div  style={{ display: "flex", alignItems: "center" }}>
           <span>Book</span>
          <Select
            showSearch
            placeholder="Filter by book"
            value={selectedBook}
            onChange={(value) => setSelectedBook(value)}
            allowClear
            style={{ width: 150, marginLeft: 5 }}
            options={books?.map((book) => ({
              label: book.name,
              value: book.name,
            }))}
          />
        </div>
      ),
      dataIndex: "book",
      render: (book) => book?.name || "Unknown Book",
      key: "book",
      onHeaderCell: () => ({
        style: { backgroundColor: "#00EAFF", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
      width: 150
    }, 
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      onHeaderCell: () => ({
        style: { backgroundColor: "#00EAFF", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
      width: 90
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      onHeaderCell: () => ({
        style: { backgroundColor: "#00EAFF", fontWeight: "bold", textAlign: "center" }, // Light green header
      }),
      width: 250
    },
    {
      title: "Sub Descriptions",
      dataIndex: "sub_descriptions",
      key: "sub_descriptions",
      width: "450px",
      render: (sub_descriptions) =>
        sub_descriptions && sub_descriptions.length > 0 ? (
          <div>
            {sub_descriptions.map((sub, index) => (
              <div key={index}>
                <div>
                <strong style={{ color: "#0F4C75" }}>{sub.code}</strong>: {sub.sub_description}
              </div>
              {sub.sub_data && (
                <div style={{ 
                  marginLeft: 16,
                  padding: 4,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 4,
                  borderLeft: '3px solid #1890ff'
                }}>
                  <strong>Notes:</strong> {sub.sub_data}
                </div>
              )}
            </div>
            ))}
          </div>
        ) : (
          "N/A"
        ),
        onHeaderCell: () => ({
          style: { backgroundColor: "#00EAFF", fontWeight: "bold", textAlign: "center" }, // Light green header
        }),
    },
  ];

    if (userRole === "Admin" || userRole === "Contributor" || userRole === "reviewer") {
      columns.push({
        title: "Actions",
        key: "actions",
        onHeaderCell: () => ({
          style: { backgroundColor: "#00EAFF", fontWeight: "bold", textAlign: "center" }, // Light green header
        }),
        render: (text, record) => (
          <Space direction="vertical" style={{ width: "180px"}}>
            <div>
            {/* Admin & Contributor can Edit */}
            {(userRole === "Admin" || userRole === "Contributor") && (
              <Button
                type="primary"
                icon= {<EditOutlined />}
                onClick={() => showEditModal(record)}
                style={{ backgroundColor: "#ff9f00", borderColor: "#ff9f00", color: "black" }}
              >
                Edit
              </Button>
            )}
  
            {/* Admin can Delete */}
            {(userRole === "Admin" || userRole === "Contributor") && (
              <Popconfirm
                title="Are you sure you want to delete this code?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  style={{ backgroundColor: "#d90027", borderColor: "#d90027", marginLeft: 5 }}
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Button>
              </Popconfirm>
            )}
            </div>

             {/* ✅ View History Button */}
             {(userRole === "Admin" || userRole === "Contributor" || userRole === "reviewer") && (
              <Button type="default" onClick={() => handleViewHistory(record)}
               style={{display: "block", paddingLeft: "2px"}} icon={<HistoryOutlined />}>
              View History
              </Button>
             )}
          </Space>
        ),
      });
    }

    // ✅ Add Reactions column LAST and make it visible only for Admin, Contributor, and Reviewer
if (userRole === "Admin" || userRole === "Contributor" || userRole === "reviewer"|| userRole === "View") {
  columns.push({
    title: "Reactions",
    key: "reactions",
    onHeaderCell: () => ({
      style: { backgroundColor: "#5cb3ff7f", fontWeight: "bold", textAlign: "center" }, // Light green header
    }),
    // In your columns definition where reactions are rendered:
    render: (text, record) => {
  // These values will now persist after refresh
  const isLiked = record.liked;
  const isDisliked = record.disliked;

  return (
    <Space size="middle">
      {/* Like Button - will stay colored after refresh */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 8px',
        // border: isLiked ? '2px solid #52c41a' : '2px solid transparent',
        borderRadius: '4px',
        // backgroundColor: isLiked ? '#f6ffed' : 'transparent'
      }}>
        <Button
          type="text"
          icon={<LikeFilled style={{
            color: isLiked ? "#52c41a" : "#d9d9d9",
            fontSize: "25px"
          }} />}
          onClick={() => handleReaction(record.id, "like")}
        />
        <span style={{
          color: isLiked ? "#52c41a" : "#8c8c8c",
          fontWeight: isLiked ? "600" : "400"
        }}>
          {record.like_count || 0}
        </span>
      </div>

      {/* Dislike Button - will stay colored after refresh */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 8px',
        // border: isDisliked ? '2px solid #f5222d' : '2px solid transparent',
        borderRadius: '4px',
        // backgroundColor: isDisliked ? '#fff2f0' : 'transparent'
      }}>
        <Button
          type="text"
          icon={<DislikeFilled style={{
            color: isDisliked ? "#f5222d" : "#d9d9d9",
            fontSize: "25px"
          }} />}
          onClick={() => handleReaction(record.id, "dislike")}
        />
        <span style={{
          color: isDisliked ? "#f5222d" : "#8c8c8c",
          fontWeight: isDisliked ? "600" : "400"
        }}>
          {record.dislike_count || 0}
        </span>
      </div>
    </Space>
  );
}
  });
}
    
  return (
    <div style={{ padding: "20px" }}>
      <h1>Code List</h1>

       {/* 🔍 Search Bar */}
       <Input
        placeholder="Search by book name, Code, Description, Sub-description and code..."
        value={globalSearch}
        onChange={(e) => setGlobalSearch(e.target.value)}
        style={{ marginBottom: "16px", width: "500px", marginRight: "40%" }}
      />

       {/* Only Admin & Contributor can add codes */}
       {(userRole === "Admin" || userRole === "Contributor") && (
      <Button type="primary" onClick={showModal} style={{ marginBottom: "16px", backgroundColor: "#007BFF"}}>
        Add Code
      </Button>)}
     
      {status === "loading" && <Spin size="large" style={{ display: "block", margin: "20px auto" }} />}
      {status === "failed" && <Alert message="Error" description={error} type="error" showIcon />}

      {status === "succeeded" && Array.isArray(filteredCodes) && filteredCodes.length > 0 ? (
        <Table
        key={filteredCodes.length}
        dataSource={filteredCodes.map((code, index) => ({
          ...code, 
          key: code.id || index,
          srNo: index + 1,
         // dataSource={filteredCodes},
        }))}
        columns={columns}
        bordered
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}
      />
      ) : (
        <Alert message="No codes available" type="info" showIcon />
      )}

      <AddCodeModal open={isModalOpen} onClose={() => setIsModalOpen(false)} 
         loggedInUserId={currentUser?.id}
        />
      <EditCodeModal 
        open={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        code={selectedCode} 
        onEdit={handleEdit} // ✅ Pass correct function
        loggedInUserId={currentUser?.id}
      />
       
        {/* ✅ History Modal */}
      <HistoryModal
        open={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={historyData}
      />
    </div>
  );
};

export default Codes;