import React, { useEffect, useState } from "react";
import { Button, Space, Table, Typography, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AddStockMedicineModal from "../Modals/AddStockMedicineModal";
import AddMedicineStockModal from "../Modals/AddMedicineStockModal";
import { getMedicineStock } from "../Redux/Slices/StockSlice";
import dayjs from "dayjs";

const { Title } = Typography;

const StockItems = () => {
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const dispatch = useDispatch();

  const { stockMedicines, loading } = useSelector((state) => state.stock);

  useEffect(() => {
    dispatch(getMedicineStock());
  }, [dispatch]);

  const columns = [
    {
      title: "Batch Number",
      dataIndex: "batch_number",
      key: "batch_number",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      key: "expiry_date",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Purchase Price",
      dataIndex: "purchase_price",
      key: "purchase_price",
    },
    {
      title: "Selling Price",
      dataIndex: "selling_price",
      key: "selling_price",
    },
    {
      title: "Last Updated",
      dataIndex: "last_updated",
      key: "last_updated",
      render: (text) => (text ? dayjs(text).format("DD-MM-YYYY"): "-"),
    },
  ];

  return (
    <div>
      <Title level={3}>Stock Items Management</Title>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsAddMedicineOpen(true)}>
          Add Medicine
        </Button>
        <Button type="dashed" onClick={() => setIsAddStockOpen(true)}>
          Add Medicine Stock
        </Button>
      </Space>

      <AddStockMedicineModal
        open={isAddMedicineOpen}
        onCancel={() => setIsAddMedicineOpen(false)}
      />

      <AddMedicineStockModal
        open={isAddStockOpen}
        onCancel={() => setIsAddStockOpen(false)}
      />

      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={stockMedicines}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default StockItems;
