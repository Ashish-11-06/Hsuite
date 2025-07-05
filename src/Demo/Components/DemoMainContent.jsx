import { Routes, Route, Router } from "react-router-dom";
import Home from "../Pages/Home";
import PatientManagement from "../Pages/PatientManagement";
import OPDdepartment from "../Pages/OPDdepartment";
import ReportsAndAnalytics from "../Pages/ReportsAndAnalytics";
import Billing from "../Pages/Billing";
import PatientHistory from "../Pages/PatientHistory";
import OpdBill from "../Pages/OpdBill";
import Users from "../Pages/Users";
import DemoLogin from "../Pages/DemoLogin";
import HospitalRegister from "../Pages/HospitalRegister";
import Finance from "../Pages/Finance";

const DemoMainContent = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patient" element={<PatientManagement />} />
            <Route path="/opd" element={<OPDdepartment />} />
            <Route path="/reports" element={<ReportsAndAnalytics />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/patient-history" element={<PatientHistory />} />
            <Route path="/opd-bill/:id" element={<OpdBill />} />
            <Route path="/users" element={<Users />} />
            <Route path="/logindemo" element={<DemoLogin />} />
            <Route path="/demoHospitalRegister" element={<HospitalRegister />} />

        </Routes>
    )
};

export default DemoMainContent;