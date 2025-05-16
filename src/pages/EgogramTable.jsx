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
  Spin,
  Row,
  Col,
  Typography
} from "antd";
import {EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  editStatement,
  deleteStatement,
  fetchAllEgogramCategories,
  clearEgoState
} from "../Redux/Slices/egoSlice";

const { Text } = Typography;

const EgogramTable = ({ statements = [], refreshData }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { statementCategories, loading, error, success } = useSelector((state) => state.ego);

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

      // Clear any existing messages
      message.destroy();
      
      const result = await dispatch(
        editStatement({
          updatedStatement: payload,
          statement_id: editingItem.id,
        })
      );

      if (!result.error) {
        setEditModalVisible(false);
        setEditingItem(null);
        form.resetFields();
        if (refreshData) refreshData();
      } else {
        message.error("Failed to update statement");
      }
    } catch (error) {
      console.error("Validation failed or edit dispatch error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Clear any existing messages
      message.destroy();
      
      const result = await dispatch(deleteStatement(id));
      
      if (!result.error) {
        if (refreshData) refreshData();
      } else {
        message.error("Failed to delete statement");
      }
    } catch (error) {
      console.error("Delete dispatch error:", error);
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
          icon={<EditOutlined />}
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
            <Button icon={<DeleteOutlined />} type="link" danger disabled={loading}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
     <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Text strong>Total statements: {statements.length}</Text>
        </Col>
        <Col>
          <Text type="danger">
            Note: A minimum of 20 statements is mandatory for the quiz.
          </Text>
        </Col>
      </Row>
      
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