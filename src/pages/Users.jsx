import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input, Select, Switch } from "antd";
import {EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUser, toggleUserActive, createUser } from "../Redux/Slices/userSlice";
import GetDetailsCounsellorModal from "../Modals/GetDetailsCounsellorModal";

const { Option } = Select;

const Users = () => {
  const dispatch = useDispatch();
  const { list: users, loading } = useSelector((state) => state.users);

  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
  const [form] = Form.useForm();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
const [isCounsellorDetailsVisible, setIsCounsellorDetailsVisible] = useState(false);

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
    const result = await dispatch(
      updateUser({ id: editingUser.id, data: values })
    ).unwrap(); // this throws if rejected

    message.success(result.message || "User updated successfully!");
    setIsEditModalVisible(false);
    dispatch(fetchUsers());
  } catch (error) {
    message.error(error || "Failed to update user.");
    console.error("Update error:", error);
  }
};


const toggleUserStatus = async (user) => {
  try {
    const result = await dispatch(toggleUserActive(user.id)).unwrap();
    const { is_active, message: backendMessage } = result;

    message.success(
      backendMessage || `User ${is_active ? "enabled" : "disabled"} successfully!`
    );
  } catch (error) {
    // `error` here is what was returned from `rejectWithValue` in the thunk
    message.error(error || "Failed to update user status.");
  }
};


 const handleAddUser = async (values) => {
  const resultAction = await dispatch(createUser(values));

  if (createUser.fulfilled.match(resultAction)) {
    message.success(resultAction.payload?.message || "User created");
    setIsAddModalVisible(false);
    addForm.resetFields();
    dispatch(fetchUsers());
  } else if (createUser.rejected.match(resultAction)) {
    const backendError = resultAction.payload || resultAction.error?.message || "Failed to create user";
    message.error(backendError);
    console.error("User creation error:", backendError);
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
    <div style={{ display: "flex", gap: "8px" }}>
      <Button
        icon={<EditOutlined />}
        type="primary"
        onClick={() => editUser(record)}
      >
        Edit
      </Button>

      {record.role === "Counsellor" && (
        <Button
          type="default"
          onClick={() => {
            setSelectedCounsellor(record);
            setIsCounsellorDetailsVisible(true);
          }}
        >
          Details
        </Button>
      )}
    </div>
  ),
},

  ];

  return (
    <>
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
        pagination={{ pageSize: 10, showSizeChanger: false, }}
        // rowClassName={(record) => (record.disabled ? "disabled-row" : "")}
      />

      {/* <style>{`.disabled-row { background-color: #fff1f0 !important; color: #cf1322; }`}</style> */}

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
  rules={[
    { required: true, message: "Please input username!" },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "Username must not contain symbols or spaces. Only letters, numbers, and underscores are allowed.",
    },
  ]}
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
    rules={[
      { required: true, message: "Please input password!" },
      {
        pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
        message:
          "Min 6 characters, include 1 uppercase, 1 number, and 1 special character"
      },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || value !== getFieldValue("username")) {
            return Promise.resolve();
          }
          return Promise.reject(
            new Error("Password cannot be the same as username")
          );
        }
      })
    ]}
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
    <GetDetailsCounsellorModal
  open={isCounsellorDetailsVisible}
  onClose={() => {
    setIsCounsellorDetailsVisible(false);
    setSelectedCounsellor(null);
  }}
  counsellor={selectedCounsellor}
/>

    </>
  );
};

export default Users;