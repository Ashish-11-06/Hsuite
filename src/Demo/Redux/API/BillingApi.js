import React from "react";
import demoaxiosInstance from "./demoaxiosInstance";

const BillingApi ={
    GetBillByPatientId: (patient_id) => {
        return demoaxiosInstance.get(`hospital/bill/patient/${patient_id}/`)
    },

    GetBillPerticulars: () => {
        return demoaxiosInstance.get(`hospital/bill/particulars/`);
    },

    UpdatePayment: (bill_id, body) => {
        return demoaxiosInstance.patch(`hospital/bill/${bill_id}/update-payment/`, body);
    },

    DeletePerticulars: (perticular_id) => {
        return demoaxiosInstance.delete(`hospital/bill-particulars/delete/${perticular_id}/`);
    },

    UpdatePerticulars: (perticular_id, data) => {
        return demoaxiosInstance.put(`hospital/bill-perticulars/update/${perticular_id}/`, data);
    },

    GetInvoice: () => {
        return demoaxiosInstance.get(`hospital/invoices/`);
    },

    PostSuppliers: (data) => {
        return demoaxiosInstance.post(`hospital/supplier/`, data);
    },

    getSuppliers: () => {
        return demoaxiosInstance.get(`hospital/suppliers/`);
    },

    UpdatePrescriptions: (prescription_id) => {
        return demoaxiosInstance.get(`hospital/prescription/${prescription_id}/update/`);
    },

    PostPharmacyBill: (data) => {
        return demoaxiosInstance.post(`hospital/pharmacy-bill/`, data);
    },

    UpdatePharmacyBill: (bill_id, data) => {
        return demoaxiosInstance.patch(`hospital/pharmacy-bill/${bill_id}/update/`, data);
    },

    PostStockMedicine: (data) => {
        return demoaxiosInstance.post(`hospital/pharmacy/medicine/`, data);
    },

    
}
export default BillingApi;