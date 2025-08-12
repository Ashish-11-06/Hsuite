import { Routes, Route, Router } from "react-router-dom";
import PatientHome from "../Pages/PatientHome";
import PatientAppointment from "../Pages/PatientAppointment";
import PatientProfile from "../Pages/PatientProfile";
import PatientPrescriptions from "../Pages/PatientPrescriptions";

const PatientMainContent = () => {
    // const hospitalId= localStorage.getItem("Hospital-Id")
    return (
        <Routes>
            <Route path="patientHome" element={<PatientHome />} />     
            <Route path="appointments"  element={<PatientAppointment />} />
            <Route path="patientprofile" element={<PatientProfile />} />
        </Routes>
    )
};

export default PatientMainContent;