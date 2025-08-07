// src/website/WebSiteRoute.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Navbar from "./Components/Navbar";
import ThemeContext from "./ThemeContext";
import createTheme from "./theme";
import { useEffect, useState } from "react";

const WebSiteRoute = () => {
 const [theme, setTheme] = useState(createTheme());


  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await fetch("http://localhost:5000/theme"); // ⬅️ json-server
        const data = await res.json();
        setTheme(createTheme(data.colors));
      } catch (error) {
        console.error("Failed to fetch theme. Using default.", error);
      }
    };

    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </ThemeContext.Provider>
  );
};

export default WebSiteRoute;
