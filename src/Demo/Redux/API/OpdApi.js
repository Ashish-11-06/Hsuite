import React from "react";
import demoaxiosInstance from "./demoaxiosInstance";

const OpdApi = {
    PostOPD : (data) => {
        return demoaxiosInstance.post(`hospital/opd/`, data);
    },

    GetAllOPD: ()=>{
        return demoaxiosInstance.get(`hospital/opds/`);
    },

    UpdateStatus:(id, body) => {
        return demoaxiosInstance.patch(`hospital/opd/${id}/update-status/`, body);
    },
    
    GetOpdByDoctorId: (doctorId) => {
        return demoaxiosInstance.get(`hospital/opd/doctor/${doctorId}/`);
    },

    PostPrescription: (data) => {
        return demoaxiosInstance.post(`hospital/prescription/`, data);
    },
    
    GetMedicinesNames: () => {
        return demoaxiosInstance.get(`hospital/prescription/medicine-names/`);
    },

    GetPrescriptionByPatientId: (patient_id) => {
        return demoaxiosInstance.get(`hospital/prescription/patient/${patient_id}/`);
    },

    PostBillPreticulars: (data) => {
        return demoaxiosInstance.post(`hospital/bill-perticulars/`,data);
    },

    PostBill: (data) => {
        return demoaxiosInstance.post(`hospital/bill/`, data);
    }
}

export default OpdApi;