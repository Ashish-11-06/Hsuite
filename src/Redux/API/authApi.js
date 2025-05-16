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
   updateProfile: (profileData) => axiosInstance.put(`/accounts/update-profile/`, profileData),

  sendResetOTP: (emailData) => {
    return axiosInstance.post('accounts/send-reset-otp/', emailData);
  },

  verfiyResetOTP: (otpData) => {
    return axiosInstance.post('accounts/verify-reset-otp/', otpData);
  },

  ResetPassword: (passwordData) => {
    return axiosInstance.post('accounts/reset-password/', passwordData);
  }
};

export default authAPI;
