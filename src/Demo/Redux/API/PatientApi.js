import demoaxiosInstance from "./demoaxiosInstance";

const PatientApi = {
  PostPatientDetails: (data) => {
    return demoaxiosInstance.post(`hospital/patient-details/`, data);
  },

  GetAllPatients: () => {
    return demoaxiosInstance.get(`hospital/patient-detail/`);
  },

  UpdatePatient: (patient_id, data) => {
    return demoaxiosInstance.put(`hospital/patient/update/${patient_id}/`, data);
  },

  DeletePatient: (patient_id) => {
    return demoaxiosInstance.delete(`hospital/patient/delete/${patient_id}/`);
  },

  GetAllDetailHistory: (patient_id) => {
    return demoaxiosInstance.get(`hospital/patient/full-history/${patient_id}/`)
  }

};

export default PatientApi;
