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

    PostPharamacyOutBill: ()=> {
        return demoaxiosInstance.post(`hospital/pharmacy/out-bill/`);
    },
    
    
}

export default StockApi;