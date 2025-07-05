import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Typography, Spin, Table, Button, Popconfirm, message } from "antd";
import { getBillParticulars, DeletePerticular } from "../Redux/Slices/BillingSlice";
import { DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Finance = () => {
    const dispatch = useDispatch();
    const { billParticulars, loading } = useSelector((state) => state.billing);

    const handleDelete = async (id) => {
        try {
            await dispatch(DeletePerticular(id)).unwrap();
            dispatch(getBillParticulars());
        } catch (err) {
        }
    }
    useEffect(() => {
        dispatch(getBillParticulars());
    }, [dispatch]);

    const columns = [
        {
            title: "Sr. No.",
            dataIndex: "serial",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Amount (₹)",
            dataIndex: "amount",
            render: (amt) => `₹${amt}`,
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Date",
            dataIndex: "date_time",
            render: (date) => new Date(date).toLocaleString(),
        },
        // {
        //   title: "Bill ID",
        //   dataIndex: "bill",
        //   render: (bill) => bill ?? "Not Assigned",
        // },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Finance - Bill Particulars</Title>

            {loading ? (
                <Spin tip="Loading..." size="large" />
            ) : (
                <Card>
                    <Table
                        dataSource={billParticulars.map((item, index) => ({
                            ...item,
                            key: item.id,
                            serial: index + 1,
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

export default Finance;
