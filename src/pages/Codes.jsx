import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Spin, Alert, Space, Popconfirm, message, Input, Checkbox, Tooltip } from "antd";
import { fetchCodes, deleteCode, editCode, fetchBooks, reviewCode, fetchCodeHistory } from "../Redux/Slices/codeSlice";
import AddCodeModal from "../Modals/AddCodeModal";
import EditCodeModal from "../Modals/EditCodeModal"; // Import the EditCodeModal
import ReviewCodeModal from "../Modals/ReviewCodeModal";
import HistoryModal from "../Modals/HistoryModal";
import {EditOutlined, DeleteOutlined, CloseOutlined, CheckOutlined  } from "@ant-design/icons";

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
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCodes());
      dispatch(fetchBooks());
    }
  }, [status ,dispatch]);

  useEffect(() => {
    console.log("Redux codes updated:", codes);
  }, [codes]);

  // ✅ View Code History
//   const handleViewHistory = async (id) => {
//     dispatch(fetchCodeHistory(id))
//         .unwrap()
//         .then((data) => {
//             setHistoryData(data.history || []); // Ensure history is an array
//             setIsHistoryModalOpen(true); // Open the modal to show the history
//         })
//         .catch(() => message.error("Failed to fetch history"));
// };

  // console.log("Books: ", books);
  //console.log("codes: ", codes);

  //console.log("Fetched Codes from Redux:", codes);
  //console.log("Fetched Books from Redux:", books);

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
    //console.log("Updated data to be sent:", updatedData);

    dispatch(editCode(updatedData))
      .unwrap()
      .then(() => {
        message.success("Code updated successfully!");
        //console.log("Updated successfully");

        dispatch(fetchCodes()); // ✅ No useSelector inside here
        setRefresh((prev) => !prev); // 🔄 Force component to re-render

        setIsEditModalOpen(false);
        setSelectedCode(null);
      })
      .catch((error) => {
        console.error("Failed to update code", error);
        message.error("Failed to update code");
      });
  };
  
// console.log(codes.details);


// const filteredCodes = Array.isArray(codes) ? codes.filter((code) => {
//   const bookName = code.book?.name || "Unknown Book"; // Extract book name directly
//   return bookName.toLowerCase().includes(searchTerm.toLowerCase());
// }) : [];

const filteredCodes = Array.isArray(codes) ? codes.filter((code) => {
  const bookName = code.book?.name || "Unknown Book"; // Get book name safely
  const mainCode = code.code || ""; // Get main code safely
  const description = code.description || ""; // Get description safely

  // Extract sub_descriptions as a string (joining sub codes and sub descriptions)
  const subDescriptions = (code.sub_descriptions || [])
    .map(sub => `${sub.code} ${sub.sub_description}`)
    .join(" ") // Converts array to a searchable string

  // Convert everything to lowercase and check if search term exists in any field
  return [bookName, mainCode, description, subDescriptions]
    .join(" ") // Combine all fields into a single searchable string
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
}) : [];



//const filteredCodes = codes.books;

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


  const columns = [
    {
      title: "Book",
      dataIndex: "book",
      render: (book) => book?.name || "Unknown Book",
        //console.log("Record:", record); // Debugging log
     //getBookNameById(record.bookId || record.book),

      key: "book",
    }, 
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Sub Descriptions",
      dataIndex: "sub_descriptions",
      key: "sub_descriptions",
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
    
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button type="primary" onClick={() => showEditModal(record)}
           //icon ={<EditOutlined />}
           style={{ backgroundColor: "#ff9f00", 
                    borderColor: "#ff9f00", 
                 }}
           >Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this code?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" style={{backgroundColor: "#d90027", borderColor: "#d90027"}}
            //icon = {<DeleteOutlined />}
            >Delete</Button>
          </Popconfirm>
          {/* ✅ View History Button */}
          {/* <Button type="default" onClick={() => handleViewHistory(record.id)}>
            View History
          </Button> */}
        </Space>
      ),
    },
    // {
    //   title: "Review",
    //   key: "review",
    //   render: (text, record) => (
    //     <Space>
    //       {!record.reviewStatus ? ( // Show button only if not reviewed
    //         <Button type="primary" onClick={() => showReviewModal(record)} style={{backgroundColor: "#007f5f", borderColor: 
    //           "#007f5f"
    //         }}>Review</Button>
    //       ) : record.reviewStatus === "approved" ? (
    //         <span style={{ fontSize: "18px", cursor: "default", color: "green" }}><CheckOutlined /></span>
    //       ) : (
    //         <span style={{ fontSize: "18px", cursor: "default", color: "red" }}><CloseOutlined /></span> // Different color for rejected
    //       )}
    //     </Space>
    //   ),
    // },
    
    // {
    //   title: "Review Status",
    //   dataIndex: "reviewStatus",
    //   key: "reviewStatus",
    //   render: (status) => {
    //     if (status === "approved") {
    //       return <span style={{ color: "green" }}><CheckOutlined /> Approved</span>;
    //     } else if (status === "rejected") {
    //       return <span style={{ color: "red" }}><CloseOutlined /> Rejected</span>;
    //     } else {
    //       return (
    //         <span style={{ color: "#505050", fontSize: "18px" }}>
    //           <CloseOutlined /><CloseOutlined /><CloseOutlined />
    //         </span>
    //       ); // Default: Three ❌ in purple
    //     }
    //   },
    // },
    
    
  ];

  //console.log(filteredCodes);
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>Code List</h1>

       {/* 🔍 Search Bar */}
       <Input
        placeholder="Search by book name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "16px", width: "300px", marginRight: "65%" }}
      />

      <Button type="primary" onClick={showModal} style={{ marginBottom: "16px", backgroundColor: "#007BFF"}}>
        Add Code
      </Button>
     
      {status === "loading" && <Spin size="large" style={{ display: "block", margin: "20px auto" }} />}
      {status === "failed" && <Alert message="Error" description={error} type="error" showIcon />}

      {status === "succeeded" && Array.isArray(filteredCodes) && filteredCodes.length > 0 ? (
        // <Table key={codes.length} dataSource={filteredCodes.map((code, index) => ({ ...code,  id: Number(code.id),  // Convert ID to a number
        //   book: Number(code.book), // Convert book ID if needed
        //   key: index, }))} columns={columns} />
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
