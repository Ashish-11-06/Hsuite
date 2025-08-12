import axios from "axios";
import axiosInstance from "../../../Redux/API/axiosInstance";
import demoaxiosInstance from "./demoaxiosInstance";

const PatientHistoryApi = {

    //FINDING
    PostFinding: (payload) => {
        return demoaxiosInstance.post(`hospital/finding/`, payload);
    },

    GetFinding: (patient_id) => {
        return demoaxiosInstance.get(`hospital/finding/patient/${patient_id}/`)
    },

    UpdateFinding: (id, payload) => {
        return demoaxiosInstance.put(`hospital/findings/update/${id}/`, payload);
    },

    //ALLERGIES
    PostAllergies: (payload) => {
        return demoaxiosInstance.post(`hospital/allergies/`, payload);
    },

    GetAllergiesByPatientId: (patient_id) => {
        return demoaxiosInstance.get(`hospital/patients/${patient_id}/allergies/`)
    },


    //FAMILY HISTORY
    PostFamilyHistory: (payload) => {
        return demoaxiosInstance.post(`hospital/family-history/`, payload);
    },

    GetFamilyHistoryByPatientId: (patient_id) => {
        return demoaxiosInstance.get(`hospital/family-history/patient/${patient_id}/`);
    },

    //Past surgeries or past hospital records
    PostPatientPastHospitalHistory: (payload) => {
        return demoaxiosInstance.post(`hospital/past-history/`, payload);
    },

    GetPatientPastHospitalHistoryByPatientId: (patient_id) => {
        return demoaxiosInstance.get(`hospital/past-history/${patient_id}/`);
    },

    //past current hospital history
    PostPastCurrentHospitalHistory: (payload) => {
        return demoaxiosInstance.post(`hospital/past-history/current-hospital/`, payload);
    },

    GetPastCurrentHospitalHistory: (patient_id) => {
        return demoaxiosInstance.get(`hospital/past-history/current-hospital/${patient_id}/`);
    },

    //diseases
    PostDiseases: (payload) => {
        return demoaxiosInstance.post(`hospital/diseases/`, payload);
    },

    GetDiseasesByPatientId: (patient_id) => {
        return demoaxiosInstance.get(`hospital/diseases/patient/${patient_id}/`);
    },

    UpdateDiseasesStatus: (id, payload) => {
        return demoaxiosInstance.patch(`hospital/diseases/${id}/update-status/`, payload);
    },

    //Ongoing Medication
    PostOngoingMedication: (payload) => {
        return demoaxiosInstance.post(`hospital/ongoing-medication/`, payload);
    },

    GetOngoingMedication: (patient_id) => {
        return demoaxiosInstance.get(`hospital/ongoing-medication/${patient_id}/`);
    },

    //Cinical notes
    PostClinicalNotes: (payload) => {
        return demoaxiosInstance.post(`hospital/clinical-notes/`, payload);
    },

    GetClinicalNotes: (patient_id) => {
        return demoaxiosInstance.get(`hospital/clinical-notes/patient/${patient_id}/`);
    },

    //medicine
    PostMedicine: (payload) => {
        return demoaxiosInstance.post(`hospital/medicine/`, payload);
    },

    GetMedicineByPatientId: (patient_id) => {
        return demoaxiosInstance.get(`hospital/medicines/patient/${patient_id}/`);
    },

    //certificates
    PostCertificate: (payload) => {
        return demoaxiosInstance.post(`hospital/certificates/`, payload);
    },

    GetCertificates: (patient_id) => {
        return demoaxiosInstance.get(`hospital/certificate/patient/${patient_id}/`);
    },

    //attachments
    PostAttachment: (formData) => {
        return demoaxiosInstance.post(`hospital/attachments/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    GetAttachmentsByPatientId: (patient_id) => {
        return demoaxiosInstance.get(`hospital/attachments/patient/${patient_id}/`);
    },

}

export default PatientHistoryApi;