import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Spin, Alert, Space, Popconfirm, message } from "antd";
import { fetchCodes, deleteCode, editCode } from "../Redux/Slices/codeSlice";
import AddCodeModal from "../Modals/AddCodeModal";
import EditCodeModal from "../Modals/EditCodeModal"; // Import the EditCodeModal

const Codes = () => {
  const dispatch = useDispatch();
  const { codes, status, error } = useSelector((state) => state.codes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit modal
  const [selectedCode, setSelectedCode] = useState(null); // Store selected code for editing

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCodes());
    }
  }, [status, dispatch]);

  const showModal = () => setIsModalOpen(true);

  const showEditModal = (code) => {
    setSelectedCode(code); // Set selected code
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteCode(id))
        .unwrap()
        .then(() => message.success("Code deleted successfully!"))
        .catch(() => message.error("Failed to delete code"));
    } else {
      message.error("Invalid code id");
    }
  };

  const columns = [
    {
      title: "Book",
      dataIndex: "book",
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
          <ul>
            {sub_descriptions.map((sub, index) => (
              <li key={index}>
                <strong>{sub.code}</strong>: {sub.sub_description}
              </li>
            ))}
          </ul>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button type="primary" onClick={() => showEditModal(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this code?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Code List</h1>
      <Button type="primary" onClick={showModal} style={{ marginBottom: "16px" }}>
        Add Code
      </Button>

      {status === "loading" && <Spin size="large" style={{ display: "block", margin: "20px auto" }} />}
      {status === "failed" && <Alert message="Error" description={error} type="error" showIcon />}

      {status === "succeeded" && Array.isArray(codes.details) ? (
        <Table dataSource={codes.details.map((code, index) => ({ ...code, key: index }))} columns={columns} />
      ) : (
        <Alert message="No codes available" type="info" showIcon />
      )}

      <AddCodeModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditCodeModal 
        open={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        code={selectedCode} 
        onEdit={(updatedData) => {
          console.log("Updated data to be sent:", updatedData);
          
          dispatch(editCode(updatedData))
            .unwrap()
            .then(() => {
              message.success("Code updated successfully!");
              console.log("Updated successfully");
        
              // Close modal and reset selected code
              setIsEditModalOpen(false);
              setSelectedCode(null);
            })
            .catch((error) => {
              console.error("Failed to update code", error);
              message.error("Failed to update code");
            });
        }}
        
      />
    </div>
  );
};

export default Codes;