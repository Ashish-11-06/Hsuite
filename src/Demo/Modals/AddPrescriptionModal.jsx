import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Table, Space, Select, } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PostPrescription, GetMedicinesNames, } from "../Redux/Slices/OpdSlice";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import AddPresMedicineModal from "./AddPresMedicineModal";
import { PrescriptionPdfGenerator } from "../Pages/PrescriptionPdfGenerator";

const AddPrescriptionModal = ({ open, onClose, patientId, userId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [medicineList, setMedicineList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMedicineName, setSelectedMedicineName] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const medicineNames = useSelector((state) => state.opd.medicineNames || []);
  const medicineNamesFetched = useSelector((state) => state.opd.medicineNamesFetched);
  const patients = useSelector((state) => state.patient.allPatients || []);
  const hospital= useSelector((state) => state.patient.hospital || {});
  const users = useSelector((state) => state.users.users || []);

  useEffect(() => {
    if (open) {
      if (!medicineNamesFetched) dispatch(GetMedicinesNames());
      if (!patients.length) dispatch(fetchAllPatients());
      if (!users.length) dispatch(GetAllUsers());
    }
  }, [open, dispatch, medicineNamesFetched]);

  // console.log("hospital data" ,hospital)

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
      (item) =>
        !item.dosage || !item.duration_days || !item.instruction
    );
    if (incomplete) {
      return message.warning(
        "Please complete all medicine details before submitting."
      );
    }

    const patientData = patients.find(
      (p) => p.id === Number(patientId)
    );
    const doctorData = users.find((u) => u.id === Number(userId));

    if (!patientData) {
      message.error("Patient details not found.");
      return;
    }
    if (!doctorData) {
      message.error("Doctor details not found.");
      return;
    }

    const payload = {
      patient: patientId,
      user: userId,
      notes: values.notes,
      items: medicineList,
    };

    dispatch(PostPrescription(payload)).then((res) => {
      if (!res.error) {
        PrescriptionPdfGenerator({
          ...payload,
          patient_info: patientData,
          doctor_info: doctorData,
          hospital_info: hospital,
        });
        onClose();
      } else {
        message.error("Failed to submit prescription.");
      }
    });
  };

  const handleAddMedicine = (medicine) => {
    if (editingIndex !== null) {
      const updatedList = [...medicineList];
      updatedList[editingIndex] = medicine;
      setMedicineList(updatedList);
      setEditingIndex(null);
    } else {
      setMedicineList((prev) => [...prev, medicine]);
    }
    setIsAddModalOpen(false);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsAddModalOpen(true);
  };

  const handleRemoveMedicine = (index) => {
    setMedicineList((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleMedicineSelect = (value) => {
    setSelectedMedicineName(value);
    const alreadyExists = medicineList.some(
      (item) => item.medicine_name === value
    );
    if (!alreadyExists) {
      const newMedicine = {
        medicine_name: value,
        dosage: "",
        duration_days: null,
        instruction: "",
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
          <Button
            danger
            size="small"
            onClick={() => handleRemoveMedicine(index)}
          >
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item name="notes" label="Doctor's Notes">
            <Input.TextArea
              rows={3}
              placeholder="Add follow-up or special instructions..."
            />
          </Form.Item>

          <div style={{ marginBottom: 12, display: "flex", gap: 12, }}>
            <Select
              style={{ flex: 1 }}
              placeholder="Select medicine name"
              value={selectedMedicineName || undefined}
              onChange={handleMedicineSelect}
              options={medicineNames.map((name) => ({
                label: name,
                value: name,
              }))}
              allowClear
            />
            <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
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
            <Button type="primary" htmlType="submit" block>
              Submit Prescription
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <AddPresMedicineModal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingIndex(null);
        }}
        onAdd={handleAddMedicine}
        defaultData={
          editingIndex !== null
            ? medicineList[editingIndex]
            : null
        }
        prefillName={
          editingIndex === null ? selectedMedicineName : null
        }
      />
    </>
  );
};

export default AddPrescriptionModal;
