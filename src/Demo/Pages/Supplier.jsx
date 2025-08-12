import React, { useEffect, useState } from "react";
import {
    Button,
    Table,
    Spin,
    Typography,
    Input,
    Row,
    Col,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getSuppliers } from "../Redux/Slices/BillingSlice";
import AddSupplierModal from "../Modals/AddSupplierModal";
import dayjs from "dayjs";

const { Title } = Typography;
const { Search } = Input;

const Supplier = () => {
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const suppliers = useSelector((state) => state.billing.suppliers);
    const loading = useSelector((state) => state.billing.loading);

    useEffect(() => {
        dispatch(getSuppliers());
    }, [dispatch]);

    useEffect(() => {
        setFilteredSuppliers(suppliers);
    }, [suppliers]);

    const handleModalClose = () => {
        setModalVisible(false);
        dispatch(getSuppliers());
    };

    const handleSearch = (value) => {
        setSearchTerm(value);

        const lowerValue = value.toLowerCase();

        const filtered = suppliers.filter((item) => {
            const dateFormatted = item.purchase_date_time
                ? dayjs(item.purchase_date_time).format("YYYY-MM-DD")
                : "";

            return (
                item.supplier_name?.toLowerCase().includes(lowerValue) ||
                item.contact?.toLowerCase().includes(lowerValue) ||
                item.email?.toLowerCase().includes(lowerValue) ||
                dateFormatted.includes(lowerValue)
            );
        });

        setFilteredSuppliers(filtered);
    };

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

    return (
        <div style={{ padding: 20 }}>
            <Title level={3}>Supplier Management</Title>

            <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
                <Col flex="auto">
                    <Input
                        placeholder="Search by name, contact, email or date"
                        allowClear
                        style={{ width: 300 }} // 👈 controls the input width
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </Col>

                <Col>
                    <Button type="primary" onClick={() => setModalVisible(true)}>
                        Add Supplier
                    </Button>
                </Col>
            </Row>

            {loading ? (
                <Spin tip="Loading suppliers...">
                    <div style={{height: 100}}></div>
                </Spin>
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredSuppliers}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 5 }}
                />
            )}

            <AddSupplierModal visible={modalVisible} onClose={handleModalClose} />
        </div>
    );
};

export default Supplier;
