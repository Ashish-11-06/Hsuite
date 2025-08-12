import React from "react";
import demoaxiosInstance from "./demoaxiosInstance";

const StockApi = {
    GetPharmacyMedicine: () => {
        return demoaxiosInstance.get(`hospital/pharmacy-medicine/`);
    },

    PostPharmacyMedicineStock: (payload) => {
        return demoaxiosInstance.post(`hospital/pharmacy/medicine-stock/`, payload);
    },

    GetMedicineStock: () => {
        return demoaxiosInstance.get(`hospital/pharmacy/medicine-stocks/`);
    },

    GetPharmacyBillByPatientId: ({ patient_id }) => {
        return demoaxiosInstance.get(
            `hospital/prescriptions/with-bills/?patient_id=${patient_id}`
        );
    },

    PostPharmacyOutBill: (payload)=> {
        return demoaxiosInstance.post(`hospital/pharmacy/out-bill/`, payload);
    },
    
    UpdatePaymentPharmacyOutBill: (bill_id, data) => {
        return demoaxiosInstance.patch(`hospital/pharmacy/out-bill/${bill_id}/update/`, data);
    },

    GetPharmacyOutBill: () => {
        return demoaxiosInstance.get(`hospital/pharmacy/out-bills/`);
    },

    GetPrescriptionInvoice: () => {
        return demoaxiosInstance.get(`hospital/pharmacy-invoices/`);
    },

    GetInvoiceOutPharmacyBill: () => {
        return demoaxiosInstance.get(`hospital/pharmacy-out/invoices/`);
    }
}

export default StockApi;