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
    },

    UpdateDoctorAvaliability: (doctor_id, is_doctor_available) => {
        return demoaxiosInstance.patch(`hospital/hmsuser/doctor/${doctor_id}/availability/`, {is_doctor_available});
    },

    GetAvaliableDoctors: () => {
        return demoaxiosInstance.get(`hospital/hmsuser/doctors/available/`);
    },

    GetHMSUserByIdAndHospital: (user_id) => {
        return demoaxiosInstance.get(`hospital/hospital-hms-user/${user_id}/`);
    },

    PostDoctorProfile: (data) => {
        return demoaxiosInstance.post(`hospital/hmsuser/doctor-profile/create/`, data,{
            headers: {
      'Content-Type': 'multipart/form-data'
    }
        });
    },

    UpdateDoctorProfile: (user_id, data) => {
        return demoaxiosInstance.patch(`hospital/hmsuser/doctor-profile/update/${user_id}/`,data,{
            headers: {
      'Content-Type': 'multipart/form-data'
    }
        });
    }
}

export default UsersApi;