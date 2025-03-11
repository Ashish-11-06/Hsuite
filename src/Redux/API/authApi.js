import axiosInstance from "./axiosInstance.js";

const authAPI = {
  // 🔹 Register User (this automatically sends OTP)
  registerUser: (userData) => axiosInstance.post(`/accounts/register`, userData),

  // 🔹 Verify OTP
  verifyOTP: (otpData) => axiosInstance.post(`/accounts/verify-otp`, otpData),

  // 🔹 Login User
  loginUser: (credentials) => axiosInstance.post(`/accounts/login`, credentials),

   // 🔹 Update Profile
   updateProfile: (profileData) => axiosInstance.put(`/accounts/update-profile`, profileData),

   // 🔹 Fetch Users from JSON Server
  fetchAllUsers: () => axiosInstance.get(`/users`).then((res) => res.data),
};

export default authAPI;
