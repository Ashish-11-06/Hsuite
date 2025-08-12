import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, InputNumber, Table, Space, message, } from "antd";
import { useDispatch } from "react-redux";
import { postPharmacyOutBill, getPharmacyMedicine, getPharmacyOutBills } from "../Redux/Slices/StockSlice";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const AddNewBillModal = ({ open, onCancel }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [medicineOptions, setMedicineOptions] = useState([]);
    const [medicineList, setMedicineList] = useState([]);
    const [note, setNote] = useState("");

    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        const fetchMedicineNames = async () => {
            try {
                const res = await dispatch(getPharmacyMedicine()).unwrap();
                if (Array.isArray(res?.data)) {
                    const formatted = res.data.map((item) => ({
                        label: item.medicine_name,
                        value: item.medicine_name,
                    }));
                    setMedicineOptions(formatted);
                }
            } catch (err) {
                console.error("Failed to fetch medicines", err);
            }
        };

        if (open) {
            fetchMedicineNames();
            form.resetFields();
            setMedicineList([]);
            setNote("");
        }
    }, [open, dispatch, form]);


    const onSelectMedicine = (value) => {
        const alreadyExists = medicineList.find((item) => item.name === value);
        if (alreadyExists) {
            message.warning("Medicine already added");
            return;
        }

        const newEntry = {
            name: value,
            dosage: "",
            duration: "",
            quantity: 1,
        };

        setMedicineList((prev) => [...prev, newEntry]);
    };

    const handleFieldChange = (index, field, value) => {
        const updated = [...medicineList];
        updated[index][field] = value;
        setMedicineList(updated);
    };

    const saveEdit = () => {
        setEditingIndex(null);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
    };

    const removeMedicine = (index) => {
        const updated = [...medicineList];
        updated.splice(index, 1);
        setMedicineList(updated);
    };

    const handleSubmit = () => {
        const patientName = form.getFieldValue("patient_name");
        if (!patientName) {
            message.error("Patient name is required.");
            return;
        }

        if (medicineList.length === 0) {
            message.error("Please add at least one medicine.");
            return;
        }

        const payload = {
            patient_name: patientName,
            note,
            medicine_items: medicineList,
        };

        dispatch(postPharmacyOutBill(payload));
        onCancel();
    };

    const columns = [
        {
            title: "Medicine Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Dosage",
            dataIndex: "dosage",
            key: "dosage",
            render: (_, record, index) =>
                editingIndex === index ? (
                    <Input
                        value={record.dosage}
                        onChange={(e) => handleFieldChange(index, "dosage", e.target.value)}
                    />
                ) : (
                    record.dosage
                ),
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            render: (_, record, index) =>
                editingIndex === index ? (
                    <Input
                        value={record.duration}
                        onChange={(e) => handleFieldChange(index, "duration", e.target.value)}
                    />
                ) : (
                    record.duration
                ),
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            render: (_, record, index) =>
                editingIndex === index ? (
                    <InputNumber
                        min={1}
                        value={record.quantity}
                        onChange={(value) => handleFieldChange(index, "quantity", value)}
                    />
                ) : (
                    record.quantity
                ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, __, index) =>
                editingIndex === index ? (
                    <Space>
                        <Button type="link" onClick={saveEdit}>
                            Save
                        </Button>
                        <Button type="link" onClick={cancelEdit}>
                            Cancel
                        </Button>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeMedicine(index)}
                        />
                    </Space>
                ) : (
                    <Space>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => setEditingIndex(index)}
                        />
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeMedicine(index)}
                        />
                    </Space>
                ),
        },
    ];

    return (
        <>
            <Modal
                title="Add New Pharmacy Bill"
                open={open}
                onCancel={onCancel}
                footer={null}
                width={800}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        label="Patient Name"
                        name="patient_name"
                        rules={[{ required: true, message: "Please enter patient name" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Doctor's Notes">
                        <Input.TextArea
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add follow-up or special instructions..."
                        />
                    </Form.Item>

                    <Form.Item label="Select Medicine">
                        <Select
                            showSearch
                            placeholder="Select medicine"
                            options={medicineOptions}
                            onChange={onSelectMedicine}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>

                    <Table
                        dataSource={medicineList}
                        columns={columns}
                        rowKey={(record, index) => index}
                        locale={{ emptyText: "No medicines added" }}
                        pagination={false}
                        style={{ marginBottom: 20 }}
                    />

                    <Button type="primary" onClick={handleSubmit} block>
                        Submit Bill
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default AddNewBillModal;
