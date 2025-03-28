import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Spin, Alert, Space, Popconfirm, message, Input, Select } from "antd";
import { fetchCodes, deleteCode, editCode, fetchBooks, addReaction, clearReactionMessage } from "../Redux/Slices/codeSlice";
import AddCodeModal from "../Modals/AddCodeModal";
import EditCodeModal from "../Modals/EditCodeModal"; // Import the EditCodeModal
import HistoryModal from "../Modals/HistoryModal";
import {EditOutlined, DeleteOutlined, HistoryOutlined, LikeOutlined, DislikeOutlined, DislikeTwoTone, LikeTwoTone, DislikeFilled, LikeFilled } from "@ant-design/icons";

const Codes = () => {
  const dispatch = useDispatch();
  const { codes, status, error, books } = useSelector((state) => state.codes); 

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

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCodes());
      dispatch(fetchBooks());
    }
  }, []);

const handleViewHistory = async (code) => {
  //console.log("Fetching history for:", code); // Debugging

  if (!code || !code.id) {
    message.error("Invalid code");
    return;
  }

  try {
    // Fetch the main code history
    const mainHistory = code.history || [];

    // Fetch the sub-description histories
    const subHistories = await Promise.all(
      code.sub_descriptions.map(async (sub) => {
        return {
          code: sub.code,
          sub_description: sub.sub_description,
          history: sub.history || [],
        };
      })
    );

    // Combine main history and sub histories
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
    const user_id = currentUser?.id; // ✅ Get userId from the logged-in user

    if (!user_id) {
      message.error("User not found. Please log in.");
      return;
    }
    const reactionData = { user_id, description_id, action };

    // console.log("🚀 Sending Reaction Payload:", reactionData); // ✅ Debug log
  
    // dispatch(addReaction(reactionData))
    //   .unwrap()
    //   .then((response) => {
    //     // console.log("✅ API Response:", response); // ✅ Debug server response
    //     message.success(`You ${action}d this code!`);
    //     dispatch(fetchCodes());
    //   })
    //   .catch((error) => {
    //     console.error("❌ Failed to react:", error);
    //     message.error("Failed to react to code");
    //   });
    dispatch(addReaction(reactionData))
    .unwrap()
    .then((response) => {
      if (response.message) {
        message.success(response.message); // ✅ Show success message from API
      } else {
        message.success(`You ${action}d this code!`);
      }
      dispatch(fetchCodes());
      dispatch(clearReactionMessage()); // ✅ Clear any previous messages
    })
    .catch((error) => {
      console.error("❌ Failed to react:", error);
      message.error("Failed to react to code");
    });
  };

  const columns = [
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
      width: 150
    }, 
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 90
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
                <strong style={{ color: "#0F4C75" }}>{sub.code}</strong>: {sub.sub_description}
              </div>
            ))}
          </div>
        ) : (
          "N/A"
        ),
    },
  ];

    if (userRole === "Admin" || userRole === "Contributor" || userRole === "reviewer") {
      columns.push({
        title: "Actions",
        key: "actions",
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
if (userRole === "Admin" || userRole === "Contributor" || userRole === "reviewer") {
  columns.push({
    title: "Reactions",
    key: "reactions",
    render: (text, record) => {
      const userReaction = record.reactions?.find(reaction => reaction.user_id === currentUser?.id);
      const userLiked = userReaction?.action === "like";
      const userDisliked = userReaction?.action === "dislike";

      return (
        <Space size="middle">
        {/* Like Button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Button
            type="text"
            icon={
              // userLiked ? (
                <LikeFilled style={{ color: "#1890ff", fontSize: "24px" }} /> // ✅ Always Blue
              // ) : (
              //   <LikeOutlined style={{ color: "#1890ff", fontSize: "24px" }} /> // Always Blue
              // )
            }
            onClick={() => handleReaction(record.id, "like")}
          />
          <span>{record.like_count || 0}</span>
        </div>

        {/* Dislike Button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Button
            type="text"
            icon={
              // userDisliked ? (
                <DislikeFilled style={{ color: "#f5222d", fontSize: "24px" }} /> // ✅ Always Red
              // ) : (
                // <DislikeOutlined style={{ color: "#f5222d", fontSize: "24px" }} /> // Always Red
              // )
            }
            onClick={() => handleReaction(record.id, "dislike")}
          />
          <span>{record.dislike_count || 0}</span>
        </div>
      </Space>
      );
    },
  });
}
    
  return (
    <div style={{ padding: "20px" }}>
      <h1>Code List</h1>

       {/* 🔍 Search Bar */}
       <Input
        placeholder="Search by book name..."
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
         // dataSource={filteredCodes},
        }))}
        columns={columns}
        bordered
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