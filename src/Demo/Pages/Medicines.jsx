import React, { useEffect, useState } from "react";
import { Button, Table, Spin, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AddStockMedicineModal from "../Modals/AddStockMedicineModal";
import { getPharmacyMedicine } from "../Redux/Slices/StockSlice";

const { Title } = Typography;

const Medicines = () => {
  const dispatch = useDispatch();
  const { pharmacyMedicines, loading } = useSelector((state) => state.stock);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getPharmacyMedicine());
    // console.log(pharmacyMedicines)
  }, [dispatch]);

  const columns = [
    {
      title: "Medicine Name",
      dataIndex: "medicine_name",
      key: "medicine_name",
    },
    {
      title: "Type",
      dataIndex: "medicine_type",
      key: "medicine_type",
    },
    {
      title: "Unit",
      dataIndex: "medicine_unit",
      key: "medicine_unit",
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      key: "manufacturer",
      render: (text) => text || "N/A",
    },
    {
      title: "Narcotic",
      dataIndex: "is_narcotic",
      key: "is_narcotic",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "N/A",
    },
  ];

  return (
    <div>
      <Title level={3}>Pharmacy Medicines</Title>

      <Button type="primary" onClick={() => setModalOpen(true)} style={{ marginBottom: 16 }}>
        Add Medicine
      </Button>

      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={pharmacyMedicines || []}
          columns={columns}
          rowKey="id"
          bordered
        />
      )}

      <AddStockMedicineModal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          dispatch(getPharmacyMedicine()); // Refresh data after modal close
        }}
      />
    </div>
  );
};

export default Medicines;
