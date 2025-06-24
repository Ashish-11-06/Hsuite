import axios from "axios";
import demoaxiosInstance from "./demoaxiosInstance";

const UsersApi = {
    AddUsersByAdmin: (payload) => {
        return demoaxiosInstance.post(`hospital/hmsuser/admin/add-user/`, payload);
    },

    GetAllUsers: () => {
        return demoaxiosInstance.get(`hospital/hmsuser/get-users-all/`);
    },

    UpdateUsers: (id, payload) => {
        return demoaxiosInstance.put(`hospital/hmsuser/update/${id}/`, payload);
    },

    DeleteUsers: (id) => {
        return demoaxiosInstance.delete(`hospital/hmsuser/delete/${id}/`);
    },

    UpdateUsersStatus: (id, data) => {
        return demoaxiosInstance.patch(`hospital/hmsuser/status/${id}/`, data);
    }
}

export default UsersApi;