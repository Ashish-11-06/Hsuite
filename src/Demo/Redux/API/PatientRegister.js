import axios from "axios";
import demoaxiosInstance from "./demoaxiosInstance";

const PatientRegister = {
    GetHospitalById: (hospitalId) => {
        return demoaxiosInstance.get(`hospital/hospital/${hospitalId}/`);
    },

    PatientRegistration: (data) => {
        return demoaxiosInstance.post(`hospital/patient/register/`, data);
    },

    PatientVerifyOTP: (data) => {
        return demoaxiosInstance.post(`hospital/patient/verify-otp/`, data);
    },

    PatientLogin: (body, hospitalId) => {
        return demoaxiosInstance.post(`hospital/patient/login/`, body, {
            headers: {
                "Hospital-ID": hospitalId,
            },
        });
    },

    PatientForgetPassword: (data) => {
        return demoaxiosInstance.post(`hospital/patient/forgot-password/`, data);
    },

    patientPasswordVerifyOTP: (data) => {
        return demoaxiosInstance.post(`hospital/patient/forget-password/verify-otp/`, data);
    },

    patientResentPassword: (data) => {
        return demoaxiosInstance.post(`hospital/patient/reset-password/`, data);
    },

    postDoctorTimeTable: (data) => {
        return demoaxiosInstance.post(`hospital/doctor-timetable/`, data);
    },

    getDoctorTimetable: (doctorId) => {
        return demoaxiosInstance.get(`hospital/doctor-timetable/${doctorId}/`);
    },

    UpdateDoctorTimeTable: (timetableId, data) => {
        return demoaxiosInstance.put(`hospital/doctor-timetable/${timetableId}/update/`, data);
    },

    GetAppointmentByDoctorId: (doctorId) => {
        return demoaxiosInstance.get(`hospital/doctor/${doctorId}/appointments/`);
    },

    UpdateAppointmentDoctor: (appointmentId, data) => {
        return demoaxiosInstance.patch(`hospital/patient/appointment/${appointmentId}/doctor-status/`, data);
    },

    PostPatientAppointment: (payload) => {
        return demoaxiosInstance.post(`hospital/patient/appointment/`, payload);
    },

    UpdatePatientAppointment: (appointmentId, body) => {
        return demoaxiosInstance.patch(`hospital/patient/appointment/${appointmentId}/patient-response/`, body);
    },

    GetAppointmentsByPatientId: (patient_id) => {
        return demoaxiosInstance.get(`hospital/patient/${patient_id}/appointments/`);
    },

    GetByPatientId: (patient_id) => {
        return demoaxiosInstance.get(`hospital/patient/${patient_id}/`)
    }
}

export default PatientRegister;