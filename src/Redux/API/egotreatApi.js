import axios from "axios";
import axiosInstance from "./axiosInstance.js";

const egotreatApi = {
    addTreatment: () => {
        return axiosInstance.post(`assessments/treatment/`);
    }

}

export default egotreatApi;
