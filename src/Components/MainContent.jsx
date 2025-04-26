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

const MainContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books" element={<Books />} />
      <Route path="/about" element={<About />} />
      <Route path="/codes" element={<Codes />} />
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/users" element={<Users />}></Route>
      <Route path="/assessents" element={<Assessments />}></Route>
      <Route path="/report" element={<Report />}></Route>
      <Route path="/createset" element={<Createset />}></Route>
      <Route path="/createmcq" element={<CreateMCQ />}></Route>
      <Route path="/mcqtest" element={<MCQTest />}></Route>
      <Route path="/mcqreport" element={<MCQReport />}></Route>
    </Routes>
  );
};

export default MainContent;