import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Spin, Alert, Space, Popconfirm, message, Input, Checkbox, Tooltip, Select } from "antd";
import { fetchCodes, deleteCode, editCode, fetchBooks, reviewCode, fetchCodeHistory } from "../Redux/Slices/codeSlice";
import AddCodeModal from "../Modals/AddCodeModal";
import EditCodeModal from "../Modals/EditCodeModal"; // Import the EditCodeModal
import ReviewCodeModal from "../Modals/ReviewCodeModal";
import HistoryModal from "../Modals/HistoryModal";
import {EditOutlined, DeleteOutlined, CloseOutlined, CheckCircleOutlined, HistoryOutlined } from "@ant-design/icons";

const Codes = () => {
  const dispatch = useDispatch();
  const { codes, status, error, books } = useSelector((state) => state.codes); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedReviewCode, setSelectedReviewCode] = useState(null);
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
  }, [status ,dispatch]);

  useEffect(() => {
   // console.log("Redux codes updated:", codes);
  }, [codes]);

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

  //review code model
  const showReviewModal = (code) => {
    setSelectedReviewCode(code);
    setIsReviewModalOpen(true);
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

//for handle review of codes
const handleReview = (id, status) => {
  dispatch(reviewCode({ id, status }))
    .unwrap()
    .then(() => {
      message.success(`Review marked as ${status}`);
      dispatch(fetchCodes()); // Refresh list after review
    })
    .catch(() => message.error("Failed to update review"));

  setIsReviewModalOpen(false);
};

// Function to handle book selection
const handleBookChange = (value) => {
  setSelectedBook(value);
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
        //console.log("Record:", record); // Debugging log
     //getBookNameById(record.bookId || record.book),

      key: "book",
      width: 150
    }, 
    {
      // title: (
      //   <div>
      //     Code
      //     <Select
      //       showSearch
      //       placeholder="Filter by Code"
      //       value={codeSearchTerm}
      //       onChange={(value) => setCodeSearchTerm(value)}
      //       allowClear
      //       style={{ width: 150, marginLeft: 10 }}
      //       options={codes?.map((code) => ({
      //         label: code.code,
      //         value: code.code,
      //       }))}
      //     />
      //   </div>
      // ),
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

    if (userRole === "Admin" || userRole === "Reviewer") {
      columns.push({
        title: "Review",
        key: "review",
        
        render: (text, record) => (
          <Space>
            {!record.reviewStatus || record.reviewStatus === "pending" ? (
              <Button type="primary" onClick={() => showReviewModal(record)}>
                Review
              </Button>
            ) : record.reviewStatus === "approved" ? (
              <span style={{ fontSize: "18px", color: "green" }}><CheckCircleOutlined /></span>
            ) : (
              <span style={{ fontSize: "18px", color: "red" }}><CloseOutlined /></span>
            )}
          </Space>
        ),
      });
    }
    

    if (userRole === "Admin" || userRole === "Reviewer" || userRole === "contributor") {
      columns.push({
        title: "Review Status",
        dataIndex: "reviewStatus",
        key: "reviewStatus",
        width: "110px",
        render: (status) => {
          if (status === "approved") {
            return <span style={{ color: "green" }}><CheckCircleOutlined /> Approved</span>;
          } else if (status === "rejected") {
            return <span style={{ color: "red" }}><CloseOutlined /> Rejected</span>;
          } else {
            return (
              <span style={{ color: "#505050", fontSize: "18px" }}>
                <CloseOutlined /> <CloseOutlined /> <CloseOutlined />
              </span>
            ); // ✅ Default: Three ❌ icons for "Pending Review"
          }
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
       <ReviewCodeModal open={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} onReview={handleReview} code={selectedReviewCode} />

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