import { Routes, Route, Router } from "react-router-dom";
import Home from "../Pages/Home";

const DemoMainContent = () => {
    console.log('asdjflkajlsd');
    return (
        <Routes>
            <Route path="/demohome" element={<Home />} />
        </Routes>
    )
};

export default DemoMainContent;