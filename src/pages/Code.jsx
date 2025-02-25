import React, { useState } from "react";
import { Layout, Button, Table, Space, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddCodeModal from "../Modals/AddCodeModal";

const { Content } = Layout;

const Code = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [codeList, setCodeList] = useState([
    { key: "1", bookName: "Book A", code: "C001", description: "Description 1", subDescription: "Sub Desc 1" },
    { key: "2", bookName: "Book B", code: "C002", description: "Description 2", subDescription: "Sub Desc 2" },
  ]);

  // Handle Deletion
  const handleDelete = (key) => {
    setCodeList(codeList.filter((item) => item.key !== key));
    message.success("Code deleted successfully!");
  };

  // Handle Editing (For Now, Just Logs)
  const handleEdit = (record) => {
    console.log("Edit Record:", record);
    message.info(`Editing ${record.bookName} (Implement edit logic)`);
  };

  // Table Columns
  const columns = [
    { title: "Sr.", dataIndex: "sr", key: "sr", render: (_, __, index) => index + 1 }, // Serial Number
    { title: "Book Name", dataIndex: "bookName", key: "bookName" },
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Sub Description", dataIndex: "subDescription", key: "subDescription" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure you want to delete?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Content style={{ padding: "20px" }}>
      <h1>Code List</h1>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: "20px" }}>
        Add Code
      </Button>

      {/* Code Table */}
      <Table columns={columns} dataSource={codeList} pagination={{ pageSize: 5 }} />

      {/* Add Code Modal */}
      <AddCodeModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Content>
  );
};

export default Code;
