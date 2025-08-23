import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Books from "../pages/Books.jsx";
import Codes from "../pages/Codes.jsx";
import Profile from "../pages/Profile.jsx";
import Users from "../pages/Users.jsx";
import Assessments from "../pages/Assessments.jsx";
import Createset from "../pages/Createset.jsx";
import Report from "../pages/Report.jsx";
import CreateMCQ from "../pages/CreateMCQ.jsx";
import MCQTest from "../pages/MCQTest.jsx";
import MCQReport from "../pages/MCQReport.jsx";
import Assessment from "../pages/Assessment.jsx";
import CreateEgogram from "../pages/CreateEgogram.jsx";
import EgogramTest from "../pages/EgogramTest.jsx";
import EgogramReport from "../pages/EgogramReport.jsx";
import CodingAutomation from "../pages/CodingAutomation.jsx";
import ClinicalNotes from "../pages/ClinicalNotes.jsx";
import WorkOrganisation from "../pages/WorkOrganisation.jsx";
import Treatment from "../pages/Treatment.jsx";
import Counsellor from "../pages/Counsellor.jsx";
import CounsellorTreatment from "../pages/CounsellorTreatment.jsx";
import Therapies from "../pages/Therapies.jsx";
import ViewResults from "../pages/ViewResults.jsx";
import AddTreatment from "../pages/AddTreatment.jsx";
import OngoingCounTreatment from "../pages/OngoingCounTreatment.jsx";
import MindfulnessPage from "../pages/MindFulnessPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import MedicalProtectedRoute from "./MedicalProtectedRoute.jsx";
import MHHome from "../pages/MHHome.jsx";
import MindVideo from "../pages/MindVideo.jsx";
import Blog from "../pages/Blog.jsx";
import MHProfile from "../pages/MHProfile.jsx";

const MainContent = ({ isMedical }) => {
  if (isMedical) {
    // 🔹 only for /medicalHealth/*
    return (
      <Routes>
        {/* Public routes */}
        <Route index element={<MHHome />} />
        <Route path="mindfulness" element={<MindfulnessPage />} />
        <Route path="mindvideo" element={<MindVideo />} />
        <Route path="blog" element={<Blog />} />

        {/* Protected routes */}
        <Route
          path="assessment"
          element={
            <MedicalProtectedRoute>
              <Assessment />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="createset"
          element={
            <MedicalProtectedRoute>
              <Createset />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="assessments"
          element={
            <MedicalProtectedRoute>
              <Assessments />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="report"
          element={
            <MedicalProtectedRoute>
              <Report />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="createmcq"
          element={
            <MedicalProtectedRoute>
              <CreateMCQ />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="mcqtest"
          element={
            <MedicalProtectedRoute>
              <MCQTest />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="mcqreport"
          element={
            <MedicalProtectedRoute>
              <MCQReport />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="createegogram"
          element={
            <MedicalProtectedRoute>
              <CreateEgogram />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="testegogram"
          element={
            <MedicalProtectedRoute>
              <EgogramTest />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="egogramreport"
          element={
            <MedicalProtectedRoute>
              <EgogramReport />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="automation"
          element={
            <MedicalProtectedRoute>
              <CodingAutomation />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="clinical"
          element={
            <MedicalProtectedRoute>
              <ClinicalNotes />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="work"
          element={
            <MedicalProtectedRoute>
              <WorkOrganisation />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="treatment"
          element={
            <MedicalProtectedRoute>
              <Treatment />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="treatment/:treatmentId"
          element={
            <MedicalProtectedRoute>
              <Treatment />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="counsellor"
          element={
            <MedicalProtectedRoute>
              <Counsellor />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="counsellortreatment"
          element={
            <MedicalProtectedRoute>
              <CounsellorTreatment />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="therapy"
          element={
            <MedicalProtectedRoute>
              <Therapies />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="therapies/:counsellorId"
          element={
            <MedicalProtectedRoute>
              <Therapies />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="viewresult"
          element={
            <MedicalProtectedRoute>
              <ViewResults />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="view-results/:userId"
          element={
            <MedicalProtectedRoute>
              <ViewResults />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="addtreatment"
          element={
            <MedicalProtectedRoute>
              <AddTreatment />
            </MedicalProtectedRoute>
          }
        />
        <Route
          path="ongocountreatment"
          element={
            <MedicalProtectedRoute>
              <OngoingCounTreatment />
            </MedicalProtectedRoute>
          }
        />
        <Route
        path="mhprofile"
        element={
          <MedicalProtectedRoute>
            <MHProfile />
          </MedicalProtectedRoute>
        }
         />
      </Routes>
    );
  }

  // 🔹 default (non-medical)
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/books" element={<Books />} />
      <Route path="/codes" element={<Codes />} />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Users />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default MainContent;
