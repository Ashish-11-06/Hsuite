import React, { useEffect, useState } from "react";
import { Button, Card, Table, Space, Popconfirm, Switch, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllUsers,
  DeleteUsers,
  UpdateUsersStatus,
} from "../Redux/Slices/UsersSlice";
import AddUserModal from "../Modals/AddUserModal";
import EditUsersModal from "../Modals/EditUsersModal";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isEditVisible, setIsEditVisible] = useState(false);

  useEffect(() => {
    dispatch(GetAllUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await dispatch(DeleteUsers(id));
    dispatch(GetAllUsers());
  };

  const handleStatusChange = async (user) => {
    const updatedStatus = !user.is_active;
    const payload = {
      id: user.id,
      data: { is_active: updatedStatus },
    };

    const result = await dispatch(UpdateUsersStatus(payload));
    if (result.payload && result.payload.message) {
      message.success(result.payload.message);
    }
    dispatch(GetAllUsers());
  };

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "srNo",
      key: "srNo",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Designation",
      dataIndex: "designation",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "status",
      render: (_, record) => (
        <Switch
          checked={record.is_active}
          onChange={() => handleStatusChange(record)}
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
          style={{
            backgroundColor: record.is_active ? "#52c41a" : "#ff4d4f",
          }}
        />
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditUser(record);
              setIsEditVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="User Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          Add User
        </Button>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={users} loading={loading} />
      <AddUserModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      <EditUsersModal
        visible={isEditVisible}
        onClose={() => {
          setIsEditVisible(false);
          setEditUser(null);
        }}
        userData={editUser}
      />
    </Card>
  );
};

export default Users;
