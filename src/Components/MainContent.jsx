import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Books from "../pages/Books.jsx";
import Codes from "../pages/Codes.jsx";

const MainContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books" element={<Books />} />
      <Route path="/about" element={<About />} />
      <Route path="/codes" element={<Codes />} />
    </Routes>
  );
};

export default MainContent;