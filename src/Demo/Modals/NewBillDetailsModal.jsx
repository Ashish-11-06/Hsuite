import React, { useEffect, useState } from "react";
import { Modal, Typography, Table, Tag, Button, Select, message } from "antd";
import { useDispatch } from "react-redux";
import { updatePaymentPharmacyOutBill } from "../Redux/Slices/StockSlice";

const { Text } = Typography;
const { Option } = Select;

const NewBillDetailsModal = ({ open, onClose, bill, onPaymentSuccess }) => {
    const dispatch = useDispatch();
    const [editingPayment, setEditingPayment] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        if (bill) {
            setIsPaid(bill.payment_status === "paid");
        }
    }, [bill]);

    if (!bill) return null;

    const handlePayment = async () => {
        if (!selectedMethod) {
            message.warning("Please select a payment method.");
            return;
        }

        try {
            await dispatch(
                updatePaymentPharmacyOutBill({
                    id: bill.id,
                    payment_status: "paid",
                    payment_mode: selectedMethod,
                })
            ).unwrap();
            setIsPaid(true);
            setEditingPayment(false);
            onClose(); // close modal on success
            onPaymentSuccess?.();
        } catch (error) {
            message.error("Failed to update payment.");
        }
    };

    const medicineColumns = [
        {
            title: "Medicine Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Dosage",
            dataIndex: "dosage",
            key: "dosage",
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (val) => `₹${val}`,
        },
    ];

    const summaryColumns = [
        {
            title: "Total Amount",
            dataIndex: "total_amount",
            key: "total_amount",
            render: (val) => `₹${val}`,
        },
        {
            title: "Payment Status",
            dataIndex: "payment_status",
            key: "payment_status",
            render: () => (
                <Tag color={isPaid ? "green" : "red"}>
                    {isPaid ? "paid" : "unpaid"}
                </Tag>
            ),
        },
        {
            title: "Payment Method",
            dataIndex: "payment_mode",
            key: "payment_mode",
            render: (_, record) =>
                editingPayment ? (
                    <Select
                        style={{ width: 120 }}
                        placeholder="Select"
                        onChange={(val) => setSelectedMethod(val)}
                        defaultValue={selectedMethod}
                    >
                        <Option value="cash">Cash</Option>
                        <Option value="netbanking">Net Banking</Option>
                        <Option value="upi">UPI</Option>
                        <Option value="cad">Card</Option>
                    </Select>
                ) : (
                    record.payment_mode || "-"
                ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => {
                if (isPaid) {
                    return <Button disabled>Paid</Button>;
                }

                return editingPayment ? (
                    <Button
                        type="primary"
                        onClick={handlePayment}
                        disabled={!selectedMethod}
                    >
                        Pay
                    </Button>
                ) : (
                    <Button
                        type="default"
                        onClick={() => setEditingPayment(true)}
                    >
                        Pay Bill
                    </Button>
                );
            },
        },
    ];

    return (
        <Modal
            title="Bill Details"
            open={open}
            onCancel={() => {
                setEditingPayment(false);
                onClose();
            }}
            footer={null}
            width={800}
        >
            <div style={{ marginBottom: 16 }}>
                <Text strong>Patient Name:</Text> {bill.patient_name}
            </div>
            {bill.note && (
                <div style={{ marginBottom: 16 }}>
                    <Text strong>Note:</Text> {bill.note}
                </div>
            )}

            <div style={{ marginBottom: 24 }}>
                <Text strong>Medicine Items:</Text>
                <Table
                    columns={medicineColumns}
                    dataSource={bill.medicine_items || []}
                    pagination={false}
                    rowKey={(record, index) => index}
                    bordered
                    style={{ marginTop: 8 }}
                />
            </div>

            <div>
                <Text strong>Summary:</Text>
                <Table
                    columns={summaryColumns}
                    dataSource={[bill]}
                    pagination={false}
                    rowKey="id"
                    bordered
                    style={{ marginTop: 8 }}
                />
            </div>
        </Modal>
    );
};

export default NewBillDetailsModal;
