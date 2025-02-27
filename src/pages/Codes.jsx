import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Spin, Alert, Space, Popconfirm, message } from "antd";
import { fetchCodes, deleteCode } from "../Redux/Slices/codeSlice";
import AddCodeModal from "../Modals/AddCodeModal";


const Codes = () => {
  const dispatch = useDispatch();
  const { codes, status, error } = useSelector((state) => state.codes);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCodes());
    }
  }, [status, dispatch]);

  const showModal = () => setIsModalOpen(true);

  const handleDelete = (id) => {
    dispatch(deleteCode(id))
      .unwrap()
      .then(() => message.success("Code deleted successfully!"))
      .catch(() => message.error("Failed to delete code"));
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
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
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
    </div>
  );
};

export default Codes;