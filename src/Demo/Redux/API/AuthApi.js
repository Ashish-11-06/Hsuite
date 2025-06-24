import axios from "axios";
import demoaxiosInstance from "./demoaxiosInstance";

const AuthApi = {
    UserRegistration: (formData) => {
        return demoaxiosInstance.post(`hospital/hmsuser/register/`, formData);
    },

    UserLogin: (formData) => {
        return demoaxiosInstance.post(`hospital/hmsuser/login/`, formData);
    },

    PostHospitalAndAdmin: () => {
        return demoaxiosInstance.post(`hospital/hospital-and-admin/`);
    },
}

export default AuthApi;