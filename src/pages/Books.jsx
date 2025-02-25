import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Typography, Spin, Alert, Button, Space, Popconfirm, message } from "antd";
import { fetchBooks, deleteBook } from "../Redux/bookSlice";
import AddBookModal from "../Modals/AddBookModal";
import EditBookModal from "../Modals/EditBookModal"; // Import edit modal

const { Title } = Typography;

const Books = () => {
  const dispatch = useDispatch();
  const { books, status, error } = useSelector((state) => state.books);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for Add modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit modal
  const [selectedBook, setSelectedBook] = useState(null); // Store selected book for editing

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
    //   title: "Published Year",
    //   dataIndex: "first_publish_year",
    //   key: "first_publish_year",
    // },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button type="primary" onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this book?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Books List</Title>

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
        <Table columns={columns} dataSource={books.map((book, index) => ({ ...book, key: index }))} bordered />
      )}

      {/* Add Book Modal */}
      <AddBookModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Edit Book Modal */}
      {selectedBook && (
        <EditBookModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          book={selectedBook}
        />
      )}
    </div>
  );
};

export default Books;
