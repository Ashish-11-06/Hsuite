import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Table, Button, Space, Select, Tag, Modal, InputNumber, Spin, Collapse, Divider } from "antd";
import { DownloadOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchBillByPatientId, clearBillData, updatePayment } from "../Redux/Slices/BillingSlice";
import { generateBillPDF } from "./generateBillPDF";

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const PatientBill = ({ patient }) => {
  const dispatch = useDispatch();
  const { billData, hospital } = useSelector((state) => state.billing);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient?.id) {
      dispatch(clearBillData());
      setPaymentData([]);
      setLoading(true);

      dispatch(fetchBillByPatientId(patient.id)).then((res) => {
        const bills = res?.payload?.data || [];

        const formattedPayments = bills.map((b, index) => ({
          key: b.bill_id || index,
          date: b.payment_date_time
            ? new Date(b.payment_date_time).toLocaleDateString()
            : "—",
          amount: b.paid_amount || 0,
          totalAmount: b.total_amount || 0,
          status: b.status || "Unpaid",
          method: b.payment_mode || "Cash",
          isEditing: false,
        }));

        setPaymentData(formattedPayments);
        setLoading(false);
      });
    }
  }, [patient, dispatch]);

  const allBills = billData ? [...billData].sort((a, b) => a.bill_id - b.bill_id) : [];

  const handlePaymentChange = (key, field, value) => {
    if (field === "status" && value === "Paid") {
      Modal.confirm({
        title: "Confirm Payment",
        content: "Has the patient fully paid the amount?",
        onOk: () => updatePaymentField(key, field, "Paid"),
        onCancel: () => updatePaymentField(key, field, "Unpaid"),
      });
    } else {
      updatePaymentField(key, field, value);
    }
  };

  const updatePaymentField = (key, field, value) => {
    setPaymentData((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, [field]: value } : item
      )
    );
  };

  const toggleEdit = (key) => {
    setPaymentData((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  const billingColumns = [
    { title: "Sr. No.", render: (_, __, i) => i + 1 },
    { title: "Date", dataIndex: "date" },
    { title: "Perticular", dataIndex: "perticular" },
    { title: "Rate", dataIndex: "rate" },
    { title: "Unit", dataIndex: "unit" },
    { title: "Amount", dataIndex: "amount" },
  ];

  const paymentColumns = [
    { title: "Date", dataIndex: "date" },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      render: (amt) => `₹${amt}`,
    },

    {
      title: "Payment Method",
      dataIndex: "method",
      render: (text, record) =>
        record.isEditing ? (
          <Select
            value={record.method}
            onChange={(val) => handlePaymentChange(record.key, "method", val)}
            style={{ width: 120 }}
          >
            <Option value="Cash">Cash</Option>
            <Option value="Card">Card</Option>
            <Option value="UPI">UPI</Option>
            <Option value="NetBanking">Net Banking</Option>
            <Option value="Other">Other</Option>
          </Select>
        ) : (
          text?.toUpperCase()
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) =>
        record.isEditing ? (
          <Select
            value={record.status}
            onChange={(val) => handlePaymentChange(record.key, "status", val)}
            style={{ width: 100 }}
          >
            <Option value="Paid">Paid</Option>
            <Option value="Unpaid">Unpaid</Option>
          </Select>
        ) : (
          <Tag color={text?.toLowerCase() === "paid" ? "green" : "red"}>
            {text?.toUpperCase()}
          </Tag>
        ),
    },
    {
  title: "Actions",
  render: (_, record) => {
    const handleSave = async () => {
      // Dispatch update
      await dispatch(
        updatePayment({
          bill_id: record.key,
          payment_mode: record.method?.toLowerCase() || "cash",
          status: record.status?.toLowerCase() || "unpaid",
        })
      );

      // Refetch data and update local paymentData
      const res = await dispatch(fetchBillByPatientId(patient.id)).unwrap();
      const bills = res?.data || [];

      const updatedPayments = bills.map((b, index) => ({
        key: b.bill_id || index,
        date: b.payment_date_time
          ? new Date(b.payment_date_time).toLocaleDateString()
          : "—",
        amount: b.paid_amount || 0,
        totalAmount: b.total_amount || 0,
        status: b.status || "Unpaid",
        method: b.payment_mode || "Cash",
        isEditing: false, // Ensure edit mode is reset
      }));

      setPaymentData(updatedPayments);
    };

    const handleEditToggle = () => {
      toggleEdit(record.key);
    };

    const isEditing = record.isEditing;
    const isPaidAndNotEditing = record.status?.toLowerCase() === "paid" && !isEditing;

    return (
      <Button
        icon={<EditOutlined />}
        type="primary"
        size="small"
        disabled={isPaidAndNotEditing}
        onClick={isEditing ? handleSave : handleEditToggle}
      >
        {isEditing ? "Save" : "Edit"}
      </Button>
    );
  },
}

  ];

  if (!patient) return null;
  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Spin tip="Loading Bill Details..." size="large" />
        </Card>
      </div>
    );
  }
  return (
    <div
      style={{
        padding: 24,
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {allBills.length === 0 ? (
        <Card style={{ marginTop: 24, width: "100%" }} bordered>
          <Text type="danger">No bills found for this patient.</Text>
        </Card>
      ) : (
        <Collapse accordion>
          {allBills.map((bill) => {
            const perticulars = bill.perticulars || [];
            const billingData = perticulars.map((item, i) => ({
              key: item.id || i,
              date: new Date(item.date_time).toLocaleDateString(),
              perticular: item.name,
              rate: parseFloat(item.amount),
              unit: 1,
              amount: parseFloat(item.amount),
            }));

            const totalAmount =
              bill.total_amount ||
              perticulars.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

            const paymentsForBill = paymentData.filter((p) => p.key === bill.bill_id);

            return (
              <Panel
                key={bill.bill_id}
                header={
                  <Row justify="space-between" style={{ width: "100%" }}>
                    <Col>Bill ID: {bill.bill_id}</Col>
                    <Col>
                      <Tag color={bill.status?.toLowerCase() === "paid" ? "green" : "red"}>
                        {bill.status?.toUpperCase() || "UNPAID"}
                      </Tag>
                    </Col>
                  </Row>
                }
              >
                <Card bordered>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Title level={5}>{patient.full_name}</Title>
                    </Col>
                    <Col>
                      <Text type="secondary">Patient ID: {patient.patient_id}</Text>
                    </Col>
                  </Row>

                  <div style={{ lineHeight: 2, marginTop: 8 }}>
                    <Text>{patient.age} | {patient.gender} | {patient.blood_group}</Text>
                    <br />
                    <Text>{patient.contact_number} | {patient.address}</Text>
                  </div>

                  <Divider />

                  <Title level={5}>Billing Details</Title>
                  <Table columns={billingColumns} dataSource={billingData} pagination={false} bordered size="small" />
                  <div style={{ marginTop: 12, textAlign: "right", fontWeight: "bold", fontSize: 16 }}>
                    Total Amount: ₹{totalAmount}
                  </div>

                  <Title level={5} style={{ marginTop: 24 }}>Payment Summary</Title>
                  <Table columns={paymentColumns} dataSource={paymentsForBill} pagination={false} bordered size="small" />

                  <Row justify="space-between" style={{ marginTop: 20 }}>
                    <Col />
                    <Col>
                      <Space>
                        {bill.status?.toLowerCase() === "paid" && (
                          <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={() => generateBillPDF(patient, bill, billingData, paymentsForBill, hospital)}
                          ></Button>
                        )}
                        <Tag color={bill.status?.toLowerCase() === "paid" ? "green" : "red"}>
                          {bill.status?.toUpperCase() || "UNPAID"}
                        </Tag>

                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Panel>
            );
          })}
        </Collapse>

      )}
    </div>
  );
};

export default PatientBill;