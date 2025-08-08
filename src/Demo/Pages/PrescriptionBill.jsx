// PrescriptionBill.jsx
import React from "react";
import { Card, Table, Input, Button, Select, Typography, message } from "antd";
import { PrescriptionInvoicePdf } from "../PDFs/PrescriptionInvoicePdf";
const { Option } = Select;
const { Text } = Typography;

const PrescriptionBill = ({
  prescription,
  editablePrescriptions,
  handleEditItem,
  getMedicineColumns,
  submittedBills,
  editBill,
  setEditBill,
  HMSuser,
  dispatch,
  postPharmacyBill,
  updatePharmacyBill,
  setSubmittedBills,
  updatingBillId,
  setUpdatingBillId,
  hospital,
}) => {
  const pharmacyBill =
    submittedBills[prescription.id] ||
    (prescription.pharmacy_bills?.length > 0
      ? prescription.pharmacy_bills[0]
      : null);
  const isPaid = pharmacyBill?.payment_status === "paid";


  return (
    <Card size="small" variant="borderless">
      <p>
        <b>Date Issued:</b>{" "}
        {new Date(prescription.date_issued).toLocaleString()}
      </p>
      <p>
        <b>Notes:</b> {prescription.notes}
      </p>

      <b>
        Medicines {isPaid && <span style={{ color: "#52c41a" }}></span>}
      </b>

      <Table
        columns={getMedicineColumns(prescription.id, isPaid)}
        dataSource={editablePrescriptions[prescription.id]}
        rowKey={(record) => record.id}
        pagination={false}
        size="small"
        style={{ marginTop: 10 }}
      />

      {!isPaid ? (
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={async () => {
            const selectedItems =
              editablePrescriptions[prescription.id]?.filter((item) => item.selected);

            if (!selectedItems.length) {
              message.warning("Please select at least one medicine.");
              return;
            }

            const medical_items = selectedItems.map((item) => ({
              name: item.pharmacy_medicine?.medicine_name,
              dosage: item.dosage,
              amount: item.amount,
              duration: `${item.duration_days} days`,
              quantity: item.quantity,
            }));

            const body = {
              hospital_id: HMSuser.hospital,
              patient_id: prescription.patient.id,
              prescription_id: prescription.id,
              user_id: HMSuser.id,
              date_issued: new Date().toISOString().split("T")[0],
              medical_items,
            };

            try {
              const res = await dispatch(postPharmacyBill(body)).unwrap();
              setSubmittedBills((prev) => ({
                ...prev,
                [prescription.id]: res.data,
              }));
            } catch (err) {
              console.error(err);
              message.error("Failed to submit pharmacy bill.");
            }
          }}
        >
          Submit Prescription
        </Button>
      ) : (
        <div style={{ marginTop: 16, color: "#52c41a", fontWeight: 500 }}>
          Prescription Submitted and Paid
        </div>
      )}


      <div style={{ marginTop: 20 }}>
        <b>Payment Summary </b>
        {pharmacyBill ? (
          <>
            <Table
              columns={[
                {
                  title: "Date",
                  dataIndex: "date_issued",
                  key: "date_issued",
                  render: (text) => new Date(text).toLocaleDateString(),
                },
                {
                  title: "Total Amount",
                  dataIndex: "total_amount",
                  key: "total_amount",
                  render: (text) => `₹ ${text}`,
                },
                {
                  title: "Payment Method",
                  dataIndex: "payment_mode",
                  key: "payment_mode",
                  render: (_, record) =>
                    record.payment_status === "paid" ? (
                      record.payment_mode
                    ) : (
                      <Select
                        placeholder="Select method"
                        size="small"
                        style={{ width: 100 }}
                        onChange={(value) =>
                          setEditBill((prev) => ({
                            ...prev,
                            [record.id]: {
                              ...(prev[record.id] || {}),
                              payment_mode: value,
                            },
                          }))
                        }
                        value={editBill[record.id]?.payment_mode}
                      >
                        <Option value="cash">Cash</Option>
                        <Option value="card">Card</Option>
                        <Option value="upi">UPI</Option>
                      </Select>
                    ),
                },
                {
                  title: "Status",
                  dataIndex: "payment_status",
                  key: "payment_status",
                  render: (text) => (
                    <span
                      style={{
                        backgroundColor: text === "paid" ? "#d9f7be" : "#fff1f0",
                        color: text === "paid" ? "#389e0d" : "#cf1322",
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontWeight: 500,
                      }}
                    >
                      {text.toUpperCase()}
                    </span>
                  ),
                },
                {
                  title: "Actions",
                  key: "actions",
                  render: (_, record) =>
                    record.payment_status === "paid" ? (
                      <Button type="default" size="small" disabled>
                        Paid
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        size="small"
                        loading={updatingBillId === record.id}
                        onClick={async () => {
                          const billId = record.id;
                          const selected = editBill[billId];

                          if (!selected?.payment_mode) {
                            message.warning("Please select a payment method.");
                            return;
                          }

                          setUpdatingBillId(billId);

                          try {
                            const payload = {
                              payment_mode: selected.payment_mode,
                              payment_status: "paid",
                            };

                            const res = await dispatch(
                              updatePharmacyBill({ bill_id: billId, data: payload })
                            ).unwrap();

                            setSubmittedBills((prev) => ({
                              ...prev,
                              [prescription.id]: res.data,
                            }));
                          } catch (err) {
                            console.error(err);
                            message.error("Failed to update bill.");
                          } finally {
                            setUpdatingBillId(null);
                          }
                        }}
                      >
                        Pay Bill
                      </Button>
                    ),
                },
              ]}
              dataSource={[pharmacyBill]}
              rowKey="id"
              pagination={false}
              size="small"
            />
            {/* Print Invoice Button */}
            {pharmacyBill.payment_status === "paid" && (
              <Button
                type="default"
                style={{ marginTop: 16 }}
                onClick={() => PrescriptionInvoicePdf({
                  ...prescription,
                  ...pharmacyBill,
                  medical_items: pharmacyBill.medical_items,
                  patient: prescription.patient,
                  bill: pharmacyBill
                }, hospital)}
              >
                Print Invoice
              </Button>
            )}
          </>
        ) : (
          <Text type="secondary">No pharmacy bill submitted yet.</Text>
        )}
      </div>
    </Card>
  );
};

export default PrescriptionBill;
