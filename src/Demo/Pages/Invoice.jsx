import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Table, Typography, Spin, Tag, Input, Row, Col } from "antd";
import { getInvoice } from "../Redux/Slices/BillingSlice";
import { PrinterOutlined } from "@ant-design/icons";
import GenerateInvoiceBill from "./GenerateInvoiceBill";

const { Title, Text } = Typography;

const Invoice = () => {
  const dispatch = useDispatch();
  const { invoice, loading, hospital } = useSelector((state) => state.billing);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getInvoice());
  }, [dispatch]);


  const filteredInvoices = invoice.filter((item) =>
    item?.patient?.full_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePrint = (record) => {
    if (!hospital || !hospital?.name) {
      return;
    }
    GenerateInvoiceBill(record, hospital);
  };

  const columns = [
    {
      title: "Sr. No.",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Patient Name",
      dataIndex: "patient_name",
      render: (text) => text || "—",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Paid Amount",
      dataIndex: "paid_amount",
      render: (amt) => `₹${amt}`,
    },
    {
      title: "Print",
      key: "print",
      render: (record) => (
        <a onClick={() => handlePrint(record)} style={{ color: "#1890ff" }}>
          <PrinterOutlined /> Print
        </a>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, minHeight: "80vh" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>Invoice Details</Title>
        </Col>
        <Col>
          <Input.Search
            placeholder="Search by Patient Name"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
        </Col>
      </Row>
      
      {loading ? (
        <Spin tip="Loading Invoices..." size="large">
          <div style={{height : 100}}></div>
        </Spin>
      ) : (
        <Card style={{ marginTop: 16 }} variant="bordered">
          <Table
            dataSource={invoice.map((item) => ({
              ...item,
              key: item.id,
              patient_name: item.patient?.full_name || "—",
              department: item.department || "—",
            }))}
            columns={columns}
            bordered
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
    </div>
  );
};

export default Invoice;
