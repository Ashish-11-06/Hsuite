import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  message,
  Spin
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  editStatement,
  deleteStatement,
  fetchAllEgogramCategories,
  clearEgoState
} from "../Redux/Slices/egoSlice";

const EgogramTable = ({ statements = [], refreshData }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { statementCategories, loading, error, success } = useSelector((state) => state.ego);

  // Handle messages from Redux
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearEgoState());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      message.success(success);
      dispatch(clearEgoState());
    }
  }, [success, dispatch]);

  useEffect(() => {
    dispatch(fetchAllEgogramCategories());
  }, [dispatch]);

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      statement: record.statement,
      category: record.category || record.category_id,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        statement: values.statement,
        category: values.category,
        test: editingItem.test,
      };

      await dispatch(
        editStatement({
          updatedStatement: payload,
          statement_id: editingItem.id,
        })
      );

      setEditModalVisible(false);
      setEditingItem(null);
      form.resetFields();

      if (refreshData) refreshData();
    } catch (error) {
      // message.error("Failed to update statement. Please try again.");
      // console.error("Validation failed or edit dispatch error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteStatement(id));
      if (refreshData) refreshData();
    } catch (error) {
      // message.error("Failed to delete statement. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      key: "srNo",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Statement",
      dataIndex: "statement",
      key: "statement",
    },
    {
      title: "Category",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button 
            onClick={() => handleEdit(record)} 
            type="link"
            disabled={loading}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this statement?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            disabled={loading}
          >
            <Button type="link" danger disabled={loading}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={statements}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      <Modal
        title="Edit Statement"
        open={editModalVisible}
        onCancel={handleCancel}
        onOk={handleEditSubmit}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Statement"
            name="statement"
            rules={[{ required: true, message: "Please enter a statement" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select Category" loading={loading}>
              {statementCategories &&
                Object.entries(statementCategories).map(([id, name]) => (
                  <Select.Option key={id} value={Number(id)}>
                    {name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EgogramTable;