import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input, Select, Popconfirm } from "antd";
import axios from "axios";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm(); // Form reference

  // Fetch users from JSON Server
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
    } catch (error) {
      message.error("Failed to fetch users.");
    }
  };

  // Edit user function
  const editUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user); // Populate form with existing data
    setIsEditModalVisible(true);
  };

  // Handle save after editing
  const handleEditSave = async (values) => {
    try {
      const updatedUser = { ...editingUser, ...values };
      await axios.put(`http://localhost:3000/users/${editingUser.id}`, updatedUser);
      
      setUsers(users.map((user) => (user.id === editingUser.id ? updatedUser : user)));
      setIsEditModalVisible(false);
      message.success("User updated successfully!");
    } catch (error) {
      message.error("Failed to update user.");
    }
  };

  // Delete user function
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      message.success("User deleted successfully!");
    } catch (error) {
      message.error("Failed to delete user.");
    }
  };

  // Define table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { 
      title: "Role", 
      dataIndex: "role", 
      key: "role",
      render: (role) => (role ? role : "N/A"), // Show "N/A" if role is missing
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => editUser(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => deleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>Users List</h2>
      <Table columns={columns} dataSource={users} rowKey="id" pagination={{ pageSize: 5 }} />

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSave}
        >
          <Form.Item name="username" label="Username" rules={[{ required: true, message: "Username is required!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Email is required!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="Editor">Editor</Option>
              <Option value="Viewer">Viewer</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
