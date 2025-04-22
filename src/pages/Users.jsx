import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input, Select, Switch} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUser, toggleUserActive } from "../Redux/Slices/userSlice";

const { Option } = Select;

const Users = () => {
  const dispatch = useDispatch();
  const { list: users, loading } = useSelector((state) => state.users);

  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const roles = ["Admin", "Contributor", "Reviewer", "Student"];

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
        dispatch(fetchUsers()); // Refresh the list to ensure UI updates
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      message.error("Failed to update user.");
    }
  };

  const toggleUserStatus = async (user) => {
    console.log("Toggling user status for:", user); // Is this showing?
    try {
      const resultAction = await dispatch(toggleUserActive(user.id));
      console.log("Toggle User Result:", resultAction); // 🔍 log the response
  
      if (toggleUserActive.fulfilled.match(resultAction)) {
        const { is_active } = resultAction.payload;
        message.success(`User ${is_active ? "enabled" : "disabled"} successfully!`);
      } else {
        throw new Error("Toggle failed");
      }
    } catch (error) {
      console.error("Error toggling user:", error); // 🔍
      message.error("Failed to update user status.");
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
      render: (role) => (role ? role : "N/A"),
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
          style={{
            backgroundColor: disabled ? "#ff4d4f" : "#52c41a",
          }}
        />
      ),
    },
    
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => editUser(record)}
          >
            Edit
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>Users List</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        rowClassName={(record) => (record.disabled ? "disabled-row" : "")}
      />

      <style>
      {`
        .disabled-row {
          background-color: #fff1f0 !important;
          color: #cf1322;
        }
      `}
      </style>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSave}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username is required!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Email is required!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Role is required!" }]}
          >
            <Select placeholder="Select a role">
              {roles.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
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
