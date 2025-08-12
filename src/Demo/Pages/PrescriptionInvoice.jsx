import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getPrescriptionInvoices } from "../Redux/Slices/StockSlice";
import { Table, Spin, Typography, message, Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { PrescriptionInvoicePdf } from "../PDFs/PrescriptionInvoicePdf";

const { Title } = Typography;

const PrescriptionInvoice = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [hospital, setHospital] = useState(null);
    const [error, setError] = useState(null);

    // Fetch data using thunk manually
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                const response = await dispatch(getPrescriptionInvoices()).unwrap();
                setInvoices(response?.invoices || []);
                setHospital(response?.hospital || null);
            } catch (err) {
                setError(err?.message || "Failed to fetch invoices");
                message.error(err?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [dispatch]);

    const handlePrint = (invoice) => {
        if (!invoice) {
            message.error("Invoice data not found");
            return;
        }
        PrescriptionInvoicePdf(invoice, hospital);
    };


    const columns = [
        {
            title: "Patient Name",
            dataIndex: "patient_name",
            key: "patient_name",
        },
        {
            title: "Medicine Name",
            dataIndex: "medicine_name",
            key: "medicine_name",
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
            title: "Payment Status",
            dataIndex: "payment_status",
            key: "payment_status",
        },
        {
            title: "Total Amount",
            dataIndex: "total_amount",
            key: "total_amount",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<PrinterOutlined />} // Optional
                    onClick={() => handlePrint(record.invoice)}
                >
                    Print
                </Button>
            ),
        }
    ];

    const dataSource = invoices.flatMap((invoice) =>
        invoice.medical_items.map((item, index) => ({
            key: `${invoice.id}-${index}`,
            patient_name: invoice?.patient?.full_name,
            medicine_name: item.name,
            dosage: item.dosage,
            duration: item.duration,
            quantity: item.quantity,
            payment_status: invoice.bill?.payment_status,
            total_amount: invoice.bill?.total_amount,
            invoice: invoice,
        }))
    );

    return (
        <div style={{ padding: "20px" }}>
            <Title level={3}>Prescription Invoices</Title>

            {loading ? (
                <Spin size="large" />
            ) : error ? (
                <div style={{ color: "red" }}>Error: {error}</div>
            ) : (
                <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 10 }} />
            )}
        </div>
    );
};

export default PrescriptionInvoice;
