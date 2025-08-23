import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Table,
  Space,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PostPrescription } from "../Redux/Slices/OpdSlice";
import { getPharmacyMedicine } from "../Redux/Slices/StockSlice";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import AddPresMedicineModal from "./AddPresMedicineModal";
import AddStockMedicineModal from "../Modals/AddStockMedicineModal";
import { PrescriptionPdfGenerator } from "../Pages/PrescriptionPdfGenerator";

const AddPrescriptionModal = ({ open, onClose, patientId, userId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [medicineList, setMedicineList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedMedicineName, setSelectedMedicineName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [isPresEditModalOpen, setIsPresEditModalOpen] = useState(false); // For editing prescription
  const [isAddToStockModalOpen, setIsAddToStockModalOpen] = useState(false); // For adding new stock

  const pharmacyMedicines = useSelector((state) => state.stock.pharmacyMedicines || []);
  const medicineLoading = useSelector((state) => state.stock.loading);
  const patients = useSelector((state) => state.patient.allPatients || []);
  const hospital = useSelector((state) => state.patient.hospital || {});
  const users = useSelector((state) => state.users.users || []);

  useEffect(() => {
    if (open) {
      if (!pharmacyMedicines.length) dispatch(getPharmacyMedicine());
      if (!patients.length) dispatch(fetchAllPatients());
      if (!users.length) dispatch(GetAllUsers());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setMedicineList([]);
      setSelectedMedicineName("");
    }
  }, [open]);

  const handleFinish = (values) => {
    if (medicineList.length === 0) {
      return message.warning("Please add at least one medicine.");
    }

    const incomplete = medicineList.some(
      (item) => !item.dosage || !item.duration_days || !item.instruction
    );
    if (incomplete) {
      return message.warning("Please complete all medicine details before submitting.");
    }

    const patientData = patients.find((p) => String(p.id) === String(patientId));
    const doctorData = users.find((u) => u.id === Number(userId));
    
if (!patients.length) {
  message.error("Patient list is still loading.");
  return;
}
    if (!doctorData) return message.error("Doctor details not found.");

    const payload = {
      patient: patientId,
      user: userId,
      notes: values.notes,
      items: medicineList.map((item) => ({
        pharmacy_medicine_id: item.pharmacy_medicine_id,
        dosage: item.dosage,
        duration_days: item.duration_days,
        instruction: item.instruction,
        quantity: item.quantity,
      })),

    };

    setSubmitting(true);
    dispatch(PostPrescription(payload))
      .then((res) => {
        if (!res.error) {
          PrescriptionPdfGenerator({
            ...payload,
            items: medicineList.map((item) => ({
              ...item,
              pharmacy_medicine: pharmacyMedicines.find(
                (med) => med.id === item.pharmacy_medicine_id
              ) || { medicine_name: "Unknown" },
            })),
            patient_info: patientData,
            doctor_info: doctorData,
            hospital_info: hospital,
          });

          onClose();
        } else {
          message.error("Failed to submit prescription.");
        }
      })
      .catch(() => message.error("An unexpected error occurred."))
      .finally(() => setSubmitting(false));
  };

  const handleAddMedicine = (medicine) => {
    if (editingIndex !== null) {
      const existing = medicineList[editingIndex];
      const updated = {
        ...existing,
        ...medicine,
      };
      const updatedList = [...medicineList];
      updatedList[editingIndex] = updated;
      setMedicineList(updatedList);
      setEditingIndex(null);
    } else {
      setMedicineList((prev) => [...prev, medicine]);
    }
    setIsPresEditModalOpen(false);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsPresEditModalOpen(true);
  };

  const handleRemoveMedicine = (index) => {
    setMedicineList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMedicineSelect = (medicine) => {
    setSelectedMedicineName(medicine);

    const alreadyExists = medicineList.some(
      (item) => item.pharmacy_medicine_id === medicine.id
    );

    if (!alreadyExists) {
      const newMedicine = {
        pharmacy_medicine_id: medicine.id,
        medicine_name: medicine.medicine_name,
        dosage: "",
        duration_days: null,
        instruction: "",
        quantity: "",
      };
      setMedicineList((prev) => [...prev, newMedicine]);
    } else {
      message.info("Medicine already added.");
    }
  };


  const columns = [
    {
      title: "Medicine Name",
      dataIndex: "medicine_name",
      key: "medicine_name",
    },
    {
      title: "Dosage",
      dataIndex: "dosage",
      key: "dosage",
    },
    {
      title: "Duration (days)",
      dataIndex: "duration_days",
      key: "duration_days",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Instruction",
      dataIndex: "instruction",
      key: "instruction",
    },
    {
      title: "Action",
      key: "action",
      render: (_, __, index) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(index)}>
            Edit
          </Button>
          <Button danger size="small" onClick={() => handleRemoveMedicine(index)}>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Add Prescription"
        open={open}
        onCancel={onClose}
        footer={null}
        width={800}
        destroyOnClose={false}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="notes" label="Doctor's Notes">
            <Input.TextArea rows={3} placeholder="Add follow-up or special instructions..." />
          </Form.Item>

          <div style={{ marginBottom: 12, display: "flex", gap: 12 }}>
            <Select
              showSearch
              style={{ flex: 1 }}
              placeholder="Select medicine name"
              value={selectedMedicineName?.id || undefined}
              onChange={(id) => {
                const selectedMedicine = pharmacyMedicines.find((med) => med.id === id);
                if (selectedMedicine) {
                  handleMedicineSelect(selectedMedicine);
                }
              }}

              options={pharmacyMedicines.map((item) => ({
                label: item.medicine_name,
                value: item.id,
              }))}
              allowClear
              loading={medicineLoading}
            />

            <Button type="primary" onClick={() => setIsAddToStockModalOpen(true)}>
              + Add Medicine
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={medicineList.map((item, idx) => ({
              ...item,
              key: idx,
            }))}
            pagination={false}
            bordered
            size="small"
          />

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" block loading={submitting}>
              Submit Prescription
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ➕ Add new medicine to stock */}
      <AddStockMedicineModal
        open={isAddToStockModalOpen}
        onCancel={() => {
          setIsAddToStockModalOpen(false);
          dispatch(getPharmacyMedicine()); // refresh list
        }}
      />

      {/* ✏️ Edit existing prescription item */}
      <AddPresMedicineModal
        open={isPresEditModalOpen}
        onClose={() => {
          setIsPresEditModalOpen(false);
          setEditingIndex(null);
        }}
        onAdd={handleAddMedicine}
        defaultData={editingIndex !== null ? medicineList[editingIndex] : null}
        prefillName={editingIndex === null ? selectedMedicineName : null}
      />
    </>
  );
};

export default AddPrescriptionModal;
