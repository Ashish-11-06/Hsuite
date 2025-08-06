import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Card,
    Typography,
    Spin,
    Table,
    Button,
    Popconfirm,
    message,
    Modal,
    Form,
    Input,
    Space,
} from "antd";
import {
    getBillParticulars,
    DeletePerticular,
    updatePerticular,
} from "../Redux/Slices/BillingSlice";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddNewPerticularModal from "../Modals/AddNewPerticularModal";

const { Title } = Typography;

const Finance = () => {
    const dispatch = useDispatch();
    const { billParticulars, loading } = useSelector((state) => state.billing);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSetloading, setLoading] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const openEditModal = (record) => {
        setCurrentRecord(record);
        setLoading(true);
        form.setFieldsValue({
            name: record.name,
            amount: record.amount,
            description: record.description,
        });
        setIsModalOpen(true);
        setLoading(false);
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            await dispatch(
                updatePerticular({ id: currentRecord.id, ...values })
            ).unwrap();
            setIsModalOpen(false);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await dispatch(DeletePerticular(id)).unwrap();
            // message.success("Deleted successfully");
            dispatch(getBillParticulars());
        } catch (err) {
            message.error("Failed to delete");
        } finally {
            setLoading(false);
        }
    };

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
            title: "Type",
            dataIndex: "type",
            render: (type) => type?.toUpperCase() || "-",
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
        {
            title: "Actions",
            render: (_, record) => (
                <Space>
                    <Button type="primary" size="small" onClick={() => openEditModal(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        loading={isSetloading}
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleAddSuccess = () => {
        dispatch(getBillParticulars());
    };


    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Title level={3}>Finance - Bill Particulars</Title>
                <Button type="primary" onClick={() => setIsAddModalOpen(true)} icon={<PlusOutlined />}>
                    Add Particular
                </Button>
            </div>

            {loading ? (
                <Spin tip="Loading..." size="large">
                    <div style={{ height: 100 }}></div>
                </Spin>
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

            {/* Modal for Editing Particular */}
            <Modal
                title="Edit Bill Particular"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleUpdate}
                confirmLoading={isSetloading}
                okText="Update"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="amount" label="Amount (₹)" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <AddNewPerticularModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddSuccess={handleAddSuccess}
            />

        </div>
    );
};

export default Finance;
