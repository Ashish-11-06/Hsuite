import axiosInstance from "./axiosInstance.js";

const userAPI = {
  // 🔹 Get all users
  getUsers: () => axiosInstance.get(`/accounts/users/`),

  updateUser: (id, data) => axiosInstance.put(`accounts/users/${id}/update/`, data),

  toggleUserActive: (id) => axiosInstance.put(`accounts/users/${id}/toggle-active/`),

}

export default userAPI;
