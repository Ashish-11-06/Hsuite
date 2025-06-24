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
    }
}

export default OpdApi;