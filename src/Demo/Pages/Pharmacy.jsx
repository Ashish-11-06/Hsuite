import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Spin, Collapse, Card, Typography, Input, message, Space, } from "antd";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";
import { fetchPharmacyBillByPatientId } from "../Redux/Slices/StockSlice";
import { postPharmacyBill, updatePharmacyBill, } from "../Redux/Slices/BillingSlice";
import PrescriptionBill from "./PrescriptionBill";

const { Option } = Select;
const { Panel } = Collapse;
const { Title, Text } = Typography;

const Pharmacy = () => {
    const dispatch = useDispatch();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [editablePrescriptions, setEditablePrescriptions] = useState({});
    const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
    const [submittedBills, setSubmittedBills] = useState({});
    const [editBill, setEditBill] = useState({});
    const [updatingBillId, setUpdatingBillId] = useState(null);
    const [editingAmount, setEditingAmount] = useState({});

    const patients = useSelector((state) => state.patient.allPatients);
    const loadingPatients = useSelector((state) => state.patient.loading);
    const HMSuser = JSON.parse(localStorage.getItem("HMS-user"));

    useEffect(() => {
        dispatch(fetchAllPatients());
    }, [dispatch]);

    const handleChange = async (patientId) => {
        setSelectedPatient(patientId);
        setLoadingPrescriptions(true);
        try {
            const res = await dispatch(fetchPharmacyBillByPatientId({ patient_id: patientId })).unwrap();
            const data = res.prescriptions || [];
            setPrescriptions(data);

            const editable = {};
            data.forEach((pres) => {
                editable[pres.id] = Array.isArray(pres.items)
                    ? pres.items.map((item) => ({
                        ...item,
                        quantity: item.quantity ?? 1,
                        amount: item.amount ?? item.selling_price ?? 0,
                        selected: item.selected ?? false,
                    }))
                    : [];
            });
            setEditablePrescriptions(editable);
        } catch (error) {
            message.error("Failed to fetch pharmacy bills");
            setPrescriptions([]);
        } finally {
            setLoadingPrescriptions(false);
        }
    };

    const handleEditItem = (prescriptionId, index, field, value) => {
        setEditablePrescriptions((prev) => {
            const updatedItems = [...(prev[prescriptionId] || [])];
            if (!updatedItems[index]) return prev;
            updatedItems[index] = {
                ...updatedItems[index],
                [field]: field === "selected" ? value : Number(value),
            };
            return { ...prev, [prescriptionId]: updatedItems };
        });
    };

    const getMedicineColumns = (prescriptionId, isReadOnly = false) => [
        {
            title: "",
            key: "select",
            render: (_, __, index) =>
                isReadOnly ? (
                    <Space>✅</Space>
                ) : (
                    <Input
                        type="checkbox"
                        checked={editablePrescriptions[prescriptionId]?.[index]?.selected || false}
                        onChange={(e) =>
                            handleEditItem(prescriptionId, index, "selected", e.target.checked)
                        }
                    />
                ),
        },
        {
            title: "Medicine Name",
            dataIndex: ["pharmacy_medicine", "medicine_name"],
            key: "medicine_name",
        },
        { title: "Dosage", dataIndex: "dosage", key: "dosage" },
        { title: "Duration (Days)", dataIndex: "duration_days", key: "duration_days" },
        { title: "Instruction", dataIndex: "instruction", key: "instruction" },
        {
            title: "Quantity",
            key: "quantity",
            render: (_, __, index) =>
                isReadOnly ? (
                    editablePrescriptions[prescriptionId]?.[index]?.quantity || 0
                ) : (
                    <Input
                        type="number"
                        min={0}
                        value={editablePrescriptions[prescriptionId]?.[index]?.quantity || 0}
                        onChange={(e) =>
                            handleEditItem(prescriptionId, index, "quantity", e.target.value)
                        }
                    />
                ),
        },
        {
            title: "Amount (₹)",
            key: "amount",
            render: (_, __, index) => {
                const item = editablePrescriptions[prescriptionId]?.[index];
                const isEditing = editingAmount[`${prescriptionId}_${index}`];

                return isReadOnly ? (
                    `₹ ${item?.amount ?? 0}`
                ) : isEditing ? (
                    <Input
                        type="number"
                        size="small"
                        min={0}
                        value={item?.amount}
                        autoFocus
                        onChange={(e) =>
                            handleEditItem(prescriptionId, index, "amount", e.target.value)
                        }
                        onBlur={() =>
                            setEditingAmount((prev) => {
                                const updated = { ...prev };
                                delete updated[`${prescriptionId}_${index}`];
                                return updated;
                            })
                        }
                        onPressEnter={(e) => e.target.blur()}
                    />
                ) : (
                    <div
                        onDoubleClick={() =>
                            setEditingAmount((prev) => ({
                                ...prev,
                                [`${prescriptionId}_${index}`]: true,
                            }))
                        }
                        style={{ cursor: "pointer" }}
                        title="Double click to edit"
                    >
                        ₹ {item?.amount ?? 0}
                    </div>
                );
            },
        },

    ];

    return (
        <div style={{ padding: 20 }}>
            <Title level={4}>Select Patient</Title>
            {loadingPatients ? (
                <Spin />
            ) : (
                <Select
                    showSearch
                    style={{ width: 300 }}
                    placeholder="Select a patient"
                    onChange={handleChange}
                    value={selectedPatient}
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {patients?.map((patient) => {
                        const label = `${patient.patient_id} - ${patient.full_name}`;
                        return (
                            <Option key={patient.id} value={patient.id} label={label}>{label}</Option>
                        );
                    })}
                </Select>
            )}

            <div style={{ marginTop: 30 }}>
                {loadingPrescriptions ? (
                    <Spin tip="Loading prescriptions...">
                        <div style={{ height: 100 }}></div>
                    </Spin>
                ) : prescriptions.length === 0 && selectedPatient ? (
                    <Text>No prescriptions found for this patient.</Text>
                ) : (
                    <Collapse
                        accordion
                        items={prescriptions.map((prescription) => {
                            const bill =
                                submittedBills[prescription.id] ||
                                (prescription.pharmacy_bills?.length > 0
                                    ? prescription.pharmacy_bills[0]
                                    : null);

                            const header = (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span><b>Prescription ID:</b> {prescription.id}</span>
                                    {bill && (
                                        <span
                                            style={{
                                                backgroundColor: bill.payment_status === "paid" ? "#d9f7be" : "#fff1f0",
                                                color: bill.payment_status === "paid" ? "#389e0d" : "#cf1322",
                                                padding: "2px 8px",
                                                borderRadius: 6,
                                                fontWeight: 500,
                                                fontSize: "0.85rem",
                                            }}
                                        >
                                            {bill.payment_status.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            );

                            return {
                                key: prescription.id.toString(),
                                label: header,
                                children: (
                                    <>
                                        {prescription.patient && (
                                            <Card size="small">
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <p><b>{prescription.patient.full_name}</b></p>
                                                    <p>{prescription.patient.patient_id}</p>
                                                </div>
                                            </Card>
                                        )}

                                        <PrescriptionBill
                                            prescription={prescription}
                                            editablePrescriptions={editablePrescriptions}
                                            handleEditItem={handleEditItem}
                                            getMedicineColumns={getMedicineColumns}
                                            submittedBills={submittedBills}
                                            editBill={editBill}
                                            setEditBill={setEditBill}
                                            HMSuser={HMSuser}
                                            dispatch={dispatch}
                                            postPharmacyBill={postPharmacyBill}
                                            updatePharmacyBill={updatePharmacyBill}
                                            setSubmittedBills={setSubmittedBills}
                                            updatingBillId={updatingBillId}
                                            setUpdatingBillId={setUpdatingBillId}
                                        />
                                    </>
                                ),
                            };
                        })}
                    />
                )}
            </div>
        </div>
    );
};

export default Pharmacy;
