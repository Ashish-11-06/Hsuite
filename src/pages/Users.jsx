import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input, Select, Switch } from "antd";
import {EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUser, toggleUserActive, createUser } from "../Redux/Slices/userSlice";

const { Option } = Select;

const Users = () => {
  const dispatch = useDispatch();
  const { list: users, loading } = useSelector((state) => state.users);

  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
  const [form] = Form.useForm();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  const roleDisplayMap = {
    Admin: "Admin",
    Edit: "Contributor",
    View: "Student/User",
  };  

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const editUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsEditModalVisible(true);
  };

  const handleEditSave = async (values) => {
    try {
      const resultAction = await dispatch(
        updateUser({ id: editingUser.id, data: values })
      );
      
      if (updateUser.fulfilled.match(resultAction)) {
        setIsEditModalVisible(false);
        message.success("User updated successfully!");
        dispatch(fetchUsers());
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      message.error("Failed to update user.");
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      const resultAction = await dispatch(toggleUserActive(user.id));
      if (toggleUserActive.fulfilled.match(resultAction)) {
        const { is_active } = resultAction.payload;
        message.success(`User ${is_active ? "enabled" : "disabled"} successfully!`);
      } else {
        throw new Error("Toggle failed");
      }
    } catch (error) {
      message.error("Failed to update user status.");
    }
  };

  const handleAddUser = async (values) => {
    try {
      const resultAction = await dispatch(createUser(values));
      if (createUser.fulfilled.match(resultAction)) {
        message.success("User created successfully!");
        setIsAddModalVisible(false);
        addForm.resetFields();
        dispatch(fetchUsers());
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      message.error("Failed to create user.");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => roleDisplayMap[role] || role || "N/A",
    },
    {
      title: "Status",
      dataIndex: "disabled",
      key: "disabled",
      render: (disabled, record) => (
        <Switch
          checked={!disabled}
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
          onChange={() => toggleUserStatus(record)}
          style={{ backgroundColor: disabled ? "#ff4d4f" : "#52c41a" }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button icon={<EditOutlined />} type="primary" onClick={() => editUser(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Users List</h2>
        <Button icon={<PlusOutlined />} type="primary" onClick={() => setIsAddModalVisible(true)}>
          Add User
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        rowClassName={(record) => (record.disabled ? "disabled-row" : "")}
      />

      <style>{`.disabled-row { background-color: #fff1f0 !important; color: #cf1322; }`}</style>

      {/* Add User Modal */}
      <Modal
        title="Add New User"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddUser}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input placeholder="e.g., john_doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input placeholder="e.g., john@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <Input.Password placeholder="Enter secure password" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select role!" }]}
          >
            <Select placeholder="Select user role">
              <Option value="Admin">Admin (Full access)</Option>
              <Option value="Edit">Contributor (Edit access)</Option>
              <Option value="View">Student/User (View only)</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title={`Edit User - ${editingUser?.username || ''}`}
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSave}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input placeholder="Enter new username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: 'email', message: 'Please enter valid email!' }
            ]}
          >
            <Input placeholder="Enter new email" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select role!" }]}
          >
            <Select placeholder="Select new role">
              {Object.entries(roleDisplayMap).map(([value, label]) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;