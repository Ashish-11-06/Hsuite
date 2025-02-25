import React, { useState } from "react";
import { Table, Button } from "antd";
import AddCodeModal from "../Modals/AddCodeModal.jsx";

const dataSource = [
  {
    key: "1",
    book: 1,
    code: "f01",
    description: "sample description",
    sub_descriptions: [
      {
        code: "f01.0",
        sub_description: "sample sub description 1",
      },
      {
        code: "f01.1",
        sub_description: "sample sub description 2",
      },
    ],
  },
];

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
    render: (sub_descriptions) => (
      <ul>
        {sub_descriptions.map((sub, index) => (
          <li key={index}>
            {sub.code}: {sub.sub_description}
          </li>
        ))}
      </ul>
    ),
  },
];

const Codes = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState(dataSource);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const handleAdd = (newEntry) => {
    setData([...data, { key: (data.length + 1).toString(), ...newEntry, sub_descriptions: [] }]);
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button type="primary" onClick={showModal} style={{ marginBottom: "16px" }}>
        Add Code
      </Button>
      <Table dataSource={data} columns={columns} />
      <AddCodeModal visible={isModalVisible} onCancel={handleCancel} onAdd={handleAdd} />
    </div>
  );
};

export default Codes;
