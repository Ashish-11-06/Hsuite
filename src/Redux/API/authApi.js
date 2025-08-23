import axios from "axios";
import axiosInstance from "./axiosInstance.js";

const authAPI = {
  // 🔹 Register User (this automatically sends OTP)
  registerUser: (userData) => axiosInstance.post(`/accounts/register`, userData),

  // 🔹 Verify OTP
  verifyOTP: (otpData) => axiosInstance.post(`/accounts/verify-otp`, otpData),

  // 🔹 Login User
  loginUser: (credentials) => axiosInstance.post(`/accounts/login`, credentials),

   // 🔹 Update Profile
   updateProfile: (profileData) => {
    return axiosInstance.put(`/accounts/update-profile/`, profileData);
  },

  sendResetOTP: (emailData) => {
    return axiosInstance.post('accounts/send-reset-otp/', emailData);
  },

  verfiyResetOTP: (otpData) => {
    return axiosInstance.post('accounts/verify-reset-otp/', otpData);
  },

  ResetPassword: (passwordData) => {
    return axiosInstance.post('accounts/reset-password/', passwordData);
  },

  CompleteCounsellor: (profileData) => {
    return axiosInstance.post('accounts/complete-counsellor-profile/', profileData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  },

  UpdateCounsellorProfile: (id, updatedData) => {
     return axiosInstance.put(`accounts/update-counsellor-profile/${id}/`, updatedData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  },

  GetDashboard: () => {
    return axiosInstance.get('books/dashboard-stats/');
  }
};

export default authAPI;
