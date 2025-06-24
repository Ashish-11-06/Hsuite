// OpdBill.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Typography,
  Form,
  Input,
  Select,
  Button,
  Divider,
  Table,
  message,
} from "antd";
import { useParams } from "react-router-dom";
import { PrinterOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const OpdBill = () => {
  const { id } = useParams(); // patient ID from route
  const printRef = useRef();

  // Sample data (replace with fetch from API if needed)
  const [patient, setPatient] = useState({
    id,
    name: "John Doe",
    age: 40,
    gender: "Male",
    doctor: "Dr. Smith",
    date: new Date().toLocaleDateString(),
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [services, setServices] = useState([
    { name: "Consultation", amount: 500 },
    { name: "Medicine", amount: 200 },
    { name: "Bed Charges", amount: 1000 },
  ]);

  const totalAmount = services.reduce((sum, s) => sum + s.amount, 0);

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head><title>OPD Bill</title></head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div ref={printRef}>
          <Title level={3}>OPD Bill</Title>
          <Divider />

          <div>
            <Text strong>Patient Name:</Text> {patient.name} <br />
            <Text strong>Age / Gender:</Text> {patient.age} / {patient.gender} <br />
            <Text strong>Doctor:</Text> {patient.doctor} <br />
            <Text strong>Date:</Text> {patient.date} <br />
            <Divider />
          </div>

          <Table
            dataSource={services}
            columns={[
              { title: "Service", dataIndex: "name", key: "name" },
              { title: "Amount (₹)", dataIndex: "amount", key: "amount" },
            ]}
            pagination={false}
            rowKey="name"
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text strong>₹{totalAmount}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
          <Divider />
        </div>

        <Form layout="inline">
          <Form.Item label="Payment Method">
            <Select
              value={paymentMethod}
              onChange={setPaymentMethod}
              style={{ width: 160 }}
            >
              <Option value="Cash">Cash</Option>
              <Option value="Card">Card</Option>
              <Option value="UPI">UPI / QR Code</Option>
              <Option value="Insurance">Insurance</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={() => message.success("Payment recorded!")}>
              Submit Payment
            </Button>
          </Form.Item>

          <Form.Item>
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>
              Print
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default OpdBill;
