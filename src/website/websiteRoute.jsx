import { Routes, Route, Router } from "react-router-dom";
import Home from "./Pages/Home";


const DemoMainContent = () => {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes> 
    )
};

export default DemoMainContent;