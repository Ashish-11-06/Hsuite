import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Typography, Spin, Alert, Button, Space, Popconfirm, message, Input } from "antd";
import { fetchBooks, deleteBook } from "../Redux/Slices/bookSlice";
import {EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddBookModal from "../Modals/AddBookModal";
import EditBookModal from "../Modals/EditBookModal"; // Import edit modal

const { Title } = Typography;

const Books = () => {
  const dispatch = useDispatch();
  const { books, status, error } = useSelector((state) => state.books);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for Add modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit modal
   const currentUser = useSelector((state) => state.auth.user);
  const [selectedBook, setSelectedBook] = useState(null); // Store selected book for editing
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Add search term state

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBooks()); // Fetch books on mount
    }
  }, [status, dispatch]);

  // Function to open Add Book modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Function to open Edit Book modal
  const showEditModal = (book) => {
    setSelectedBook(book); // Set selected book
    setIsEditModalOpen(true);
  };

  // Function to delete a book
  const handleDelete = (id) => {
    dispatch(deleteBook(id))
      .unwrap()
      .then(() => message.success("Book deleted successfully!"))
      .catch(() => message.error("Failed to delete book"));
  };

    // 🔍 Filter books based on search term
    const filteredBooks = books.filter((book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.version.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Define table columns
  const columns = [
    {
      title: "Sr. No.",
      key: "srNo",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
    },
    // {
    //   title: "Updated By",
    //   dataIndex: "updated_by",
    //   key: "updated_by",
    //   render: (updated_by) => updated_by?.username, // Handle missing username
    // },
    // {
    //   title: "Created By",
    //   dataIndex: "created_by",
    //   key: "created_by",
    //   render: (created_by) => created_by?.username,
    // },
    
    
   
    // {
    //   title: "Published Year",
    //   dataIndex: "first_publish_year",
    //   key: "first_publish_year",
    // },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button type="primary" onClick={() => showEditModal(record)}
            //icon ={<EditOutlined />}
            style={{ backgroundColor: "#ff9f00", 
              borderColor: "#ff9f00", 
              color: "black" }}
            >Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this book?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" style={{backgroundColor: "#d90027", borderColor: "#d90027"}}
            //icon = {<DeleteOutlined />}
            >Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Books List</Title>

       {/* 🔍 Search Bar */}
       <Input
        placeholder="Search books by name or version..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16, width: "300px", marginRight: "65%" }}
      />

      {/* Button to open the modal */}
      <Button type="primary" onClick={showModal} style={{ marginBottom: 20 }}>
        Add Book
      </Button>

      {/* Show loading spinner */}
      {status === "loading" && <Spin size="large" style={{ display: "block", margin: "20px auto" }} />}

      {/* Show error if API fails */}
      {status === "failed" && <Alert message="Error" description={error} type="error" showIcon />}

      {/* Show table when data is available */}
      {status === "succeeded" && (
        <Table columns={columns} dataSource={filteredBooks.map((book, index) => ({ ...book, key: index, updated_by: book.updated_by }))} bordered />
      )}

      {/* Add Book Modal */}
      <AddBookModal open={isModalOpen} onClose={() => setIsModalOpen(false)} 
       loggedInUserId={currentUser?.id} 
        />

      {/* Edit Book Modal */}
      {selectedBook && (
        <EditBookModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          book={selectedBook}
          loggedInUserId={currentUser?.id}
        />
      )}
    </div>
  );
};

export default Books;
