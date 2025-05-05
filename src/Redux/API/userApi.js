import axios from "axios";
import axiosInstance from "./axiosInstance.js";

const userAPI = {
  // 🔹 Get all users
  getUsers: () => axiosInstance.get(`/accounts/users/`),

  updateUser: (id, data) => axiosInstance.put(`accounts/users/${id}/update/`, data),

  toggleUserActive: (id) => axiosInstance.put(`accounts/users/${id}/toggle-active/`),

  createUser: (data) => axiosInstance.post(`accounts/create-user/`,data),

}

export default userAPI;
