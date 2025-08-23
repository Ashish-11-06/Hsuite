import React from "react";
import axiosInstance from "./axiosInstance";

const mhAuthAPI = {
    Register: (data) => {
        return axiosInstance.post(`assessments/register-medical/`, data);
    },

    VerifyOTP: (data) => {
        return axiosInstance.post(`assessments/verify-otp/`, data);
    },

    Login: (data) => {
        return axiosInstance.post(`assessments/login/`, data);
    }
};
export default mhAuthAPI;