import React from "react";
import demoaxiosInstance from "./demoaxiosInstance";

const ReportApi = {
    PostLabReport: (payload) => {
        return demoaxiosInstance.post(`hospital/lab-report/`, payload, {
             headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    GetLabReportByLabAssistantId: (labAssistant_id) => {
        return demoaxiosInstance.get(`hospital/lab-reports/by-lab-assistant/${labAssistant_id}/`);
    },

    DeleteLabReport: (reportId) => {
        return demoaxiosInstance.delete(`hospital/lab-reports/delete/${reportId}/`);
    },

    PostBirthReport: (payload) => {
        return demoaxiosInstance.post(`hospital/birth-report/`, payload);
    },

    GetBirthReport: () => {
        return demoaxiosInstance.get(`hospital/birth-report/list/`);
    },

    PostDeathReport: (payload) => {
        return demoaxiosInstance.post(`hospital/death-report/`, payload);
    },

    GetDeathReport: () => {
        return demoaxiosInstance.get(`hospital/death-report/list/`);
    }

}

export default ReportApi;