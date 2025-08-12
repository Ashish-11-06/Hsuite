import React, { useRef, useState } from "react";
import {
  Typography,
  Button,
  Space,
  Input,
  Select,
  Form,
  InputNumber,
  message,
  Table,
  Divider,
} from "antd";
import { PrinterOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

const EstimateTab = ({ patient }) => {
  const printRef = useRef();
  const [estimateData, setEstimateData] = useState([
    {
      key: 1,
      date: "2025-06-01 09:00",
      category: "Medicine",
      description: "Paracetamol 500mg",
      amount: 150,
    },
    {
      key: 2,
      date: "2025-06-01 10:30",
      category: "Lab Test",
      description: "CBC & Blood Sugar Test",
      amount: 500,
    },
    {
      key: 3,
      date: "2025-06-02 08:00",
      category: "Bed Charges",
      description: "Private Room (per day)",
      amount: 2000,
    },
    {
      key: 4,
      date: "2025-06-03 07:30",
      category: "Procedure",
      description: "IV Drip Administration",
      amount: 300,
    },
    {
      key: 5,
      date: "2025-06-04 11:00",
      category: "Surgery",
      description: "Appendix Removal Surgery",
      amount: 15000,
    },
    {
      key: 6,
      date: "2025-06-05 08:00",
      category: "Bed Charges",
      description: "Private Room (per day)",
      amount: 2000,
    },
    {
      key: 7,
      date: "2025-06-05 11:00",
      category: "Medicine",
      description: "Antibiotics - Amoxicillin",
      amount: 450,
    },
  ]);

  const [form] = Form.useForm();

  const handleAddExpense = (values) => {
    const newEntry = {
      key: estimateData.length + 1,
      date: dayjs().format("YYYY-MM-DD HH:mm"),
      category: values.category,
      description: values.description,
      amount: values.amount,
    };

    setEstimateData([...estimateData, newEntry]);
    message.success("Expense added successfully.");
    form.resetFields();
  };

  const total = estimateData.reduce((sum, item) => sum + item.amount, 0);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Estimate</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h2 { margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f7f7f7; }
            .total-row td { font-weight: bold; }
            .total-label { text-align: right; padding-top: 12px; font-size: 16px; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const columns = [
    {
      title: "S.No.",
      dataIndex: "key",
      key: "sno",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      responsive: ["md"],
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
      render: (amt) => `₹${amt.toFixed(2)}`,
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ justifyContent: "space-between", width: "100%" }}>
        <Title level={4}>Estimated Cost Summary for {patient.name}</Title>
        <Button icon={<PrinterOutlined />} onClick={handlePrint}>
          Print Estimate
        </Button>
      </Space>

      <Form
        form={form}
        layout="inline"
        onFinish={handleAddExpense}
        style={{ marginTop: 24, flexWrap: "wrap", gap: "16px" }}
      >
        <Form.Item
          name="category"
          rules={[{ required: true, message: "Select category" }]}
        >
          <Select placeholder="Category" style={{ width: 150 }}>
            <Option value="Medicine">Medicine</Option>
            <Option value="Lab Test">Lab Test</Option>
            <Option value="Bed Charges">Bed Charges</Option>
            <Option value="Procedure">Procedure</Option>
            <Option value="Surgery">Surgery</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          rules={[{ required: true, message: "Enter description" }]}
        >
          <Input placeholder="Description" style={{ width: 200 }} />
        </Form.Item>

        <Form.Item
          name="amount"
          rules={[{ required: true, message: "Enter amount" }]}
        >
          <InputNumber
            placeholder="Amount"
            style={{ width: 120 }}
            min={0}
            prefix="₹"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Add Expense
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <Table
        dataSource={estimateData}
        columns={columns}
        pagination={false}
        rowKey="key"
        style={{ marginTop: 16 }}
        footer={() => (
          <div style={{ textAlign: "right", fontWeight: "bold" }}>
            Total Estimated Cost: ₹{total.toFixed(2)}
          </div>
        )}
      />

      {/* Hidden print content */}
      <div ref={printRef} style={{ display: "none" }}>
        <h2>Cost Estimate Report - {patient.name}</h2>
        <p>Date: {dayjs().format("YYYY-MM-DD HH:mm")}</p>

        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {estimateData.map((item) => (
              <tr key={item.key}>
                <td>{item.date}</td>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="3" className="total-label">
                Total Estimated Cost
              </td>
              <td>₹{total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstimateTab;
