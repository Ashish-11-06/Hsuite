import axios from "axios";
import axiosInstance from "./axiosInstance.js";

const AIintegrationApi = {
   codeAutomation: (formData) => {
    return axiosInstance.post(`coding/process-medical-document/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
   }

}

export default AIintegrationApi;
