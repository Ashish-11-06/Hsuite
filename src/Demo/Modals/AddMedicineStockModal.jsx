import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Select,
  Spin,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getPharmacyMedicine, postPharmacyMedicineStock, getMedicineStock } from "../Redux/Slices/StockSlice";

const { Option } = Select;

const AddMedicineStockModal = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { pharmacyMedicines, loading } = useSelector((state) => state.stock);

  useEffect(() => {
    if (open) {
      dispatch(getPharmacyMedicine());
    }

  }, [dispatch, open]);

  const handleFinish = (values) => {
    const payload = {
      medicine: values.medicine, // Correct field name
      batch_number: values.batchNumber,
      expiry_date: values.expiry.format("YYYY-MM-DD"),
      quantity: values.quantity,
      purchase_price: values.purchasePrice,
      selling_price: values.sellingPrice,
    };

    dispatch(postPharmacyMedicineStock(payload))
      .unwrap()
      .then(() => {
        // message.success("Stock added successfully");
        dispatch(getMedicineStock());
        form.resetFields();
        onCancel();
      })
      .catch((err) => {
        message.error("Failed to add stock");
        console.error(err);
      });

  };

  return (
    <Modal open={open} title="Add Medicine Stock" onCancel={onCancel} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="medicine" // 🔥 FIXED HERE (was medicineId)
          label="Medicine"
          rules={[{ required: true, message: "Please select a medicine" }]}
        >
          {loading ? (
            <Spin />
          ) : (
            <Select placeholder="Select a medicine">
              {pharmacyMedicines?.map((medicine) => (
                <Option key={medicine.id} value={medicine.id}>
                  {medicine.medicine_name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          name="batchNumber"
          label="Batch Number"
          rules={[{ required: true, message: "Please enter batch number" }]}
        >
          <Input placeholder="e.g: BN0001" />
        </Form.Item>

        <Form.Item
          name="expiry"
          label="Expiry Date"
          rules={[{ required: true, message: "Please select expiry date" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(current) => current && current < new Date().setHours(0, 0, 0, 0)}
          />

        </Form.Item>

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: "Please enter quantity" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="purchasePrice"
          label="Purchase Price"
          rules={[{ required: true, message: "Enter purchase price" }]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="sellingPrice"
          label="Selling Price"
          rules={[{ required: true, message: "Enter selling price" }]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Stock
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMedicineStockModal;
