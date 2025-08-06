import React, { useEffect, useState, useRef } from "react";
import { Table, Typography, Spin, Button } from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { getSuppliers } from "../Redux/Slices/BillingSlice";

const { Title } = Typography;

const SupplierTab = () => {
    const dispatch = useDispatch();
    const printRef = useRef(); // Ref for printing section
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);

    const suppliers = useSelector((state) => state.billing.suppliers);
    const loading = useSelector((state) => state.billing.loading);

    useEffect(() => {
        dispatch(getSuppliers());
    }, [dispatch]);

    useEffect(() => {
        setFilteredSuppliers(suppliers);
    }, [suppliers]);

    const columns = [
        {
            title: "Supplier Name",
            dataIndex: "supplier_name",
            key: "supplier_name",
        },
        {
            title: "Contact",
            dataIndex: "contact",
            key: "contact",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Purchase Date",
            dataIndex: "purchase_date_time",
            key: "purchase_date_time",
            render: (text) =>
                text ? dayjs(text).format("YYYY-MM-DD") : "Not Provided",
        },
        {
            title: "Purchase Price",
            dataIndex: "purchase_price",
            key: "purchase_price",
            render: (price) => `₹ ${price}`,
        },
    ];

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const newWindow = window.open('', '', 'height=700,width=900');
        newWindow.document.write('<html><head><title>Supplier Report</title>');
        newWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ccc; padding: 8px; text-align: left; } h1 { text-align: center; }</style>');
        newWindow.document.write('</head><body>');
        newWindow.document.write('<h1>Supplier Report</h1>');
        newWindow.document.write(printContents);
        newWindow.document.write('</body></html>');
        newWindow.document.close();
        newWindow.focus();
        newWindow.print();
        newWindow.close();
    };

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Title level={3} style={{ margin: 0 }}>Supplier Report</Title>
                <Button type="primary" onClick={handlePrint}>Print</Button>
            </div>

            {loading ? (
                <div style={{ minHeight: 150, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin tip="Loading suppliers...">
                        <div style={{height: 100}}></div>
                    </Spin>
                </div>
            ) : (
                <div ref={printRef}>
                    <Table
                        columns={columns}
                        dataSource={filteredSuppliers}
                        rowKey="id"
                        bordered
                        pagination={false}
                    />
                </div>
            )}
        </div>
    );
};

export default SupplierTab;
