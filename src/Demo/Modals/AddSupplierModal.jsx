import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Button, InputNumber } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { postSuppliers } from "../Redux/Slices/BillingSlice";

const AddSupplierModal = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.billing.loading);

    const handleFinish = (values) => {
        const formattedValues = {
            ...values,
            purchase_date_time: values.purchase_date.format("YYYY-MM-DD"),
            purchase_price: values.purchase_price.toString(),
        };

        dispatch(postSuppliers(formattedValues)).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                form.resetFields();
                onClose();
            }
        });
    };

    return (
        <Modal
            title="Add Supplier"
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    name="supplier_name"
                    label="Supplier Name"
                    rules={[{ required: true, message: "Please enter supplier name" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="contact"
                    label="Contact"
                    rules={[{ required: true, message: "Please enter contact number" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Please enter email" },
                        { type: "email", message: "Enter a valid email" },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: "Please enter address" }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    name="purchase_date"
                    label="Purchase Date"
                    rules={[{ required: true, message: "Please select purchase date" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    name="purchase_price"
                    label="Purchase Price"
                    rules={[{ required: true, message: "Please enter purchase price" }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        formatter={(value) => `₹ ${value}`}
                        parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Add Supplier
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddSupplierModal;
