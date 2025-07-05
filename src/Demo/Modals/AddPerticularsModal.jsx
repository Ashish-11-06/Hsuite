import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Select, Button, Space, message, Input, Table, Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AddNewPerticularModal from "./AddNewPerticularModal";
import { PostBill } from "../Redux/Slices/OpdSlice";
import { getBillParticulars } from "../Redux/Slices/BillingSlice";

const { Option } = Select;

const AddPerticularsModal = ({ open, onClose, onSubmit, patientId }) => {
  const dispatch = useDispatch();
  const [perticularOptions, setPerticularOptions] = useState([]);
  const [selectedPerticular, setSelectedPerticular] = useState("");
  const [perticularList, setPerticularList] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const isEditing = (record) => record.key === editingKey;

  useEffect(() => {
    if (open) {
      dispatch(getBillParticulars())
        .unwrap()
        .then((res) => {
          const all = res.data || [];
          const unbilled = all.filter((item) => item.bill === null);
          setPerticularOptions(unbilled); // save full objects
        });
    }
  }, [open, dispatch]);

  const handlePerticularAddSuccess = (name, amount, description) => {
    setPerticularOptions((prev) => [...prev, name]);
    setPerticularList((prev) => [
      ...prev,
      {
        key: Date.now(),
        perticular: name,
        quantity: 1,
        amount,
        description,
      },
    ]);
  };

  const handleSelectPerticular = (id) => {
    const selected = perticularOptions.find((item) => item.id === id);
    if (!selected) return;

    const alreadyExists = perticularList.some((item) => item.perticular === selected.name);
    if (alreadyExists) {
      message.warning("Perticular already in the list");
      return;
    }

    setSelectedPerticular(id);
    setPerticularList((prev) => [
      ...prev,
      {
        key: Date.now(),
        perticular: selected.name,
        quantity: 1,
        amount: parseFloat(selected.amount),
        description: selected.description || "",
      },
    ]);
  };

  const handleQuantityChange = (value, record) => {
    const updated = perticularList.map((item) =>
      item.key === record.key ? { ...item, quantity: value } : item
    );
    setPerticularList(updated);
  };

  const handleDelete = (record) => {
    const updated = perticularList.filter((item) => item.key !== record.key);
    setPerticularList(updated);
    if (editingKey === record.key) setEditingKey(null);
  };

  const handleSave = () => {
    setEditingKey(null);
  };

  const handleFinalSubmit = async () => {
    if (perticularList.length === 0) {
      message.warning("No perticulars added");
      return;
    }

    if (!patientId) {
      message.error("Missing patient ID");
      return;
    }

    const perticularsPayload = perticularList.map((item) => ({
      name: item.perticular,
      amount: item.amount || 0,
      description: item.description || "",
    }));

    const body = {
      patient_id: patientId,
      perticulars: perticularsPayload,
    };

    try {
      await dispatch(PostBill(body)).unwrap();
      onSubmit?.(perticularList); // optional callback
      setPerticularList([]);
      setSelectedPerticular("");
      setEditingKey(null);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: "Sr.",
      dataIndex: "sr",
      key: "sr",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Perticular",
      dataIndex: "perticular",
      key: "perticular",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => (text ? `₹ ${text}` : "-"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={text}
            type="number"
            min={1}
            style={{ width: 80 }}
            onChange={(e) => handleQuantityChange(e.target.value, record)}
          />
        ) : (
          text
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <Space>
            {editable ? (
              <Button type="primary" size="small" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Button
                type="primary"
                size="small"
                onClick={() => setEditingKey(record.key)}
              >
                Edit
              </Button>
            )}
            <Popconfirm
              title="Delete this item?"
              onConfirm={() => handleDelete(record)}
            >
              <Button danger size="small">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title="Add Perticular"
        open={open}
        onCancel={() => {
          setEditingKey(null);
          onClose();
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Select
            showSearch
            placeholder="Select Perticular"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
            value={selectedPerticular}
            style={{ width: 200 }}
            onChange={handleSelectPerticular}
          >
            {perticularOptions.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>


          <Button
            onClick={() => setAddModalVisible(true)}
            type="primary"
            icon={<PlusOutlined />}
          >
            Add New Perticular
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={perticularList}
          pagination={false}
          style={{ marginTop: 16 }}
          bordered
        />

        <div style={{ textAlign: "right", marginTop: 20 }}>
          <Button type="primary" onClick={handleFinalSubmit}>
            Submit
          </Button>
        </div>
      </Modal>

      <AddNewPerticularModal
        open={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAddSuccess={handlePerticularAddSuccess}
      />
    </>
  );
};

export default AddPerticularsModal;
