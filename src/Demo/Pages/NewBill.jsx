import React, { useEffect, useState } from "react";
import { Button, Row, Col, Table, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import AddNewBillModal from "../Modals/AddNewBillModal";
import { getPharmacyOutBills } from "../Redux/Slices/StockSlice";
import NewBillDetailsModal from "../Modals/NewBillDetailsModal";
import { NewBillPdf } from "../PDFs/NewBillPdf";

const NewBill = () => {
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [billModalOpen, setBillModalOpen] = useState(false);
    const [hospital, setHospital] = useState(null);

    const fetchBills = async () => {
        try {
            setLoading(true);
            const res = await dispatch(getPharmacyOutBills()).unwrap();
            setBills(res?.data || []);
            setHospital(res?.hospital || null);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => {
        setOpenModal(false);
        fetchBills(); // Refetch after modal closes
    };

    const openDetails = (bill) => {
        setSelectedBill(bill);
        setDetailsOpen(true);
    };

    const closeDetails = () => {
        setSelectedBill(null);
        setDetailsOpen(false);
    };

    const columns = [
        {
            title: "Patient Name",
            dataIndex: "patient_name",
            key: "patient_name",
        },
        {
            title: "Medicine Name",
            dataIndex: "medicine_items",
            key: "medicine_items",
            render: (items) => items?.map((item) => item.name).join(", "),
        },
        {
            title: "Payment Status",
            dataIndex: "payment_status",
            key: "payment_status",
            render: (status) => (
                <Tag color={status === "paid" ? "green" : "red"}>{status}</Tag>
            ),
        },
        {
            title: "Total Amount",
            dataIndex: "total_amount",
            key: "total_amount",
            render: (amount) => `₹${amount}`,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button type="primary" onClick={() => openDetails(record)}>
                        Details
                    </Button>
                    <Button type="primary" onClick={() => NewBillPdf(record, hospital)}>
                        Print
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <h2>Pharmacy Out-Patient Bills</h2>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpen}>
                        Add Bill
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={bills}
                rowKey="id"
                loading={loading}
                bordered
            />

            <AddNewBillModal open={openModal} onCancel={handleClose} />
            <NewBillDetailsModal
                open={detailsOpen}
                onClose={closeDetails}
                bill={selectedBill}
                onPaymentSuccess={() => {
                    fetchBills();
                    closeDetails();
                }}
            />
        </div>
    );
};

export default NewBill;
