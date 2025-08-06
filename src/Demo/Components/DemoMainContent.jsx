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
import IPDdepartment from "../Pages/IPDdepartment";
import Invoice from "../Pages/Invoice";
import BedStatus from "../Pages/BedStatus";
import Pharmacy from "../Pages/Pharmacy";
import Supplier from "../Pages/Supplier";
import Report from "../Pages/Report";
import StockItems from "../Pages/StockItems";
import SupplierTab from "../Tabs/SupplierTab";
import Medicines from "../Pages/Medicines";
import Profile from "../Pages/Profile";
import PastOPD from "../Pages/PastOPD";
import Appointments from "../Pages/Appointments";
import DoctorTimeTable from "../Pages/DoctorTimeTable";
import LabReport from "../Pages/LabReport";
import BirthReport from "../Pages/BirthReport";
import DeathReport from "../Pages/DeathReport";
import NewBill from "../Pages/NewBill";

const DemoMainContent = () => {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patient" element={<PatientManagement />} />
            <Route path="/opd" element={<OPDdepartment />} />
            <Route path="/reports" element={<ReportsAndAnalytics />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/patient-history" element={<PatientHistory />} />
            <Route path="/opd-bill/:id" element={<OpdBill />} />
            <Route path="/users" element={<Users />} />
            <Route path="/logindemo" element={<DemoLogin />} />
            <Route path="/demoHospitalRegister" element={<HospitalRegister />} />
            <Route path="/ipd" element={<IPDdepartment />} />
            <Route path="/bedstatus" element={<BedStatus />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/supplier-report" element={<SupplierTab />} />
            <Route path="/report" element={<Report />} />
            <Route path="/stockitems" element={<StockItems />} />
            <Route path="/medicine" element={<Medicines />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pastopd" element={<PastOPD />} />
            <Route path="/appointment" element={<Appointments />} />
            <Route path="/doctortimetable" element={<DoctorTimeTable />} />
            <Route path="/lab" element={<LabReport />} />
            <Route path="/birth" element={<BirthReport />} />
            <Route path="/death" element={<DeathReport />} />
            <Route path="/newbill" element={<NewBill />} />
        </Routes> 
    )
};

export default DemoMainContent;