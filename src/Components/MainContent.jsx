import { Routes, Route, Router } from "react-router-dom";
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
import DemoMainContent from "../Demo/Components/DemoMainContent.jsx";
import NotAuthorized from "../pages/NotAuthorized.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const MainContent = () => {
  return (
    <Routes>
      {/* <Route path="/login" element={<Login />}/> */}
      <Route path="/" element={<Home />} />
      <Route path="/books" element={<Books />} />
      <Route path="/about" element={<About />} />
      <Route path="/codes" element={<Codes />} />
      <Route path="/profile" element={<Profile />}></Route>
      {/* <Route path="/users" element={<Users />}></Route> */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route path="/assessents" element={<Assessments />}></Route>
      <Route path="/report" element={<Report />}></Route>
      <Route path="/createset" element={<Createset />}></Route>
      <Route path="/createmcq" element={<CreateMCQ />}></Route>
      <Route path="/mcqtest" element={<MCQTest />}></Route>
      <Route path="/mcqreport" element={<MCQReport />}></Route>
      <Route path="/assessment" element={<Assessment />}/>
      <Route path="/createegogram" element={<CreateEgogram />}/>
      <Route path="/testegogram" element={<EgogramTest />}/>
      <Route path="/egogramreport" element={<EgogramReport />}/>
      <Route path="/automation" element={<CodingAutomation />} />
      <Route path="/clinical" element={<ClinicalNotes />} />
      <Route path="/work" element={< WorkOrganisation />} />
      <Route path="/treatment" element={<Treatment />} />
      <Route path="/treatment/:treatmentId" element={<Treatment />} />
      <Route path="/counsellor" element={<Counsellor />} />
      <Route path="/counsellortreatment" element={<CounsellorTreatment />} />
      <Route path="/therapy" element={<Therapies />} />
      <Route path="/therapies/:counsellorId" element={<Therapies />} />
      <Route path="/viewresult" element={<ViewResults />} />
      <Route path="//view-results/:userId" element={<ViewResults />} />
      <Route path="/addtreatment" element={<AddTreatment />} />
      <Route path="/ongocountreatment" element={<OngoingCounTreatment />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />

    </Routes>
  );
};

export default MainContent;