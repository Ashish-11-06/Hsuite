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
    }
}
export default BillingApi;