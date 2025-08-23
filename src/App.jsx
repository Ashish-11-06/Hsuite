import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Layout } from "antd";
import { Navigate } from "react-router-dom";
import HeaderComponent from "./Components/HeaderComponent.jsx";
import MainContent from "./Components/MainContent.jsx";
import "./App.css";
import Login from "./pages/Login.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import ProtectedRouteDemo from "./Demo/Components/ProtectedRouteDemo.jsx";
import { useEffect } from "react";
import DemoMainContent from "./Demo/Components/DemoMainContent.jsx";
import DemoSidebar from "./Demo/Components/DemoSidebar.jsx";
import DemoHeader from "./Demo/Components/DemoHeader.jsx";
import { Provider } from "react-redux";
import storedemo from "./Demo/Redux/storedemo.js";
import store from "./Redux/store.js";
import DemoLogin from "./Demo/Pages/DemoLogin.jsx";
import PatientRegistration from "./Demo/Pages/PatientRegistration.jsx";
import PatientSidebar from "./Demo/Components/PatientSidebar.jsx";
import PatientMainContent from "./Demo/Components/PatientMainContent.jsx";
import ProtectedRoutePatient from "./Demo/Components/ProtectedRoutePatient.jsx";
import PatientHeader from "./Demo/Components/PatientHeader.jsx";
import WebSiteRoute from "./website/websiteRoute.jsx";
import ChatBot from "./pages/ChatBot.jsx";
import MHSidebar from "./Components/MHSidebar.jsx";
import NotAuthorized from "./pages/NotAuthorized.jsx";
import MHFooter from "./pages/MHFooter.jsx";
import MHLogin from "./pages/MHLogin.jsx";
import MHSignup from "./pages/MHSignup.jsx";
import MedicalProtectedRoute from "./Components/MedicalProtectedRoute.jsx";

const { Header, Content, Footer } = Layout;

// New component to handle inactivity logout using navigate inside Router
function InactivityHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const EXPIRY_HOURS = 24;
    const EXPIRY_MS = EXPIRY_HOURS * 60 * 60 * 1000;
    const LAST_ACTIVE_KEY = 'lastActiveTime';

    const updateLastActiveTime = () => {
      localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    };

    const checkExpiry = () => {
      const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
      if (lastActive) {
        const now = Date.now();
        const diff = now - parseInt(lastActive, 10);
        if (diff > EXPIRY_MS) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    // Set initial activity time if not present
    if (!localStorage.getItem(LAST_ACTIVE_KEY)) {
      updateLastActiveTime();
    }

    // Check every 1 minute
    const intervalId = setInterval(checkExpiry, 60 * 1000);

    // Listen for user activity to reset the time
    const resetTimer = () => updateLastActiveTime();
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    //listen for change sin local storage from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn' && e.newValue === 'false') {
        localStorage.clear();
        navigate("/login");
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  return null; // This component does not render anything visible
}

function App() {
  return (
    <Router>
      {/* Add inactivity check inside Router so we can use navigate */}
      <InactivityHandler />
      <Routes>
        {/* 🔑 Main Login Route */}
        <Route
          path="/login"
          element={
            <Provider store={store}>
              <Login />
            </Provider>
          }
        />
        
        <Route
        path="/medicalHealth/mhlogin"
        element={
          <Provider store={store}>
            <MHLogin />
          </Provider>
        } />

        {/* 🧪 DEMO ROUTES */}
        <Route
          path="/demo/logindemo"
          element={
            <Provider store={storedemo}>
              <DemoLogin />
            </Provider>
          }
        />

        <Route
          path="/demo/:hospitalId/patientregistration"
          element={
            <Provider store={storedemo}>
              <PatientRegistration />
            </Provider>
          }
        />

        <Route
          path="/demo/:hospitalId/patient*"
          element={
            <Provider store={storedemo}>
              <ProtectedRoutePatient>
                <Layout style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                  <Header>
                    <PatientHeader />
                  </Header>
                  <Layout style={{ minHeight: "100vh", display: "flex" }}>
                    <PatientSidebar />
                    <Content style={{ padding: "30px", overflowY: "auto" }}>
                      <PatientMainContent />
                    </Content>
                  </Layout>
                </Layout>
              </ProtectedRoutePatient>
            </Provider>
          }
        />

        {/* DEMO CODE  */}
        <Route
          path="/demo/*"
          element={
            <Provider store={storedemo}>
              <ProtectedRouteDemo>
                <Layout style={{ minHeight: "100vh", display: "flex" }}>
                  {/*demo Sidebar */}
                  <DemoSidebar style={{ width: "250px", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0, right: 0 }} />
                  {/* <PatientSidebar /> */}

                  <Layout style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                    {/* Header */}
                    <Header style={{ position: "fixed", top: 0, left: "235px", right: 0, height: "65px", zIndex: 100 }}>
                      <DemoHeader />
                    </Header>

                    {/* Main Content */}
                    <Content style={{ marginTop: "60px", padding: "30px", overflowY: "auto", flexGrow: 1, height: "calc(100vh - 60px)" }}>
                      <DemoMainContent />
                    </Content>

                    {/* Footer */}
                    {/* <Footer style={{ textAlign: "center", position: "fixed", bottom: 0, left: "250px", right: 0 }}>
                  <FooterComponent />
                </Footer> */}
                  </Layout>
                </Layout>
              </ProtectedRouteDemo>
            </Provider>
          }
        />

        <Route
          path="/web/*"
          element={
            <Provider store={storedemo}>
              {/* Main Content */}
              <Content>
                <WebSiteRoute />
              </Content>

            </Provider>
          }
        />

        {/* MAIN CODE  */}
        <Route
          path="*"
          element={
            <Provider store={store}>
              <ProtectedRoute>
                <Layout style={{ minHeight: "100vh", display: "flex" }}>
                  {/* Sidebar */}
                  <Sidebar style={{ width: "250px", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0, right: 0 }} />

                  <Layout style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                    {/* Header */}
                    <Header style={{ position: "fixed", top: 0, width: '100%', right: 0, height: "65px", zIndex: 100 }}>
                      <HeaderComponent />
                    </Header>

                    {/* Main Content */}
                    <Content style={{ marginTop: "60px", overflowY: "auto", flexGrow: 1, height: "calc(100vh - 60px)" }}>
                      <MainContent />
                    </Content>

                    {/* {chat bot } */}
                    <ChatBot />

                    {/* Footer */}
                    {/* <Footer style={{ textAlign: "center", position: "fixed", bottom: 0, left: "250px", right: 0 }}>
                  <FooterComponent />
                </Footer> */}
                  </Layout>
                </Layout>
              </ProtectedRoute>
            </Provider>
          }
        />

        {/* medical health code */}
        <Route
          path="/medicalHealth/*"
          element={
            <Provider store={store}>
              {/* <MedicalProtectedRoute> */}
                <Layout style={{ minHeight: "100vh"}}>
                  {/* Sidebar */}
                  <MHSidebar style={{ width: "250px", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0 }} />

                  <Layout style={{ minHeight: "100vh", marginLeft: "1px" }}>
                    {/* Header */}
                    {/* <Header style={{ position: "fixed", top: 0, width: '100%', right: 0, height: "65px", zIndex: 100 }}> */}
                    {/* <HeaderComponent /> */}
                    {/* </Header> */}

                    {/* Main Content */}
                    <Content style={{ marginTop: "60px", overflowY: "auto", flexGrow: 1, height: "calc(100vh - 60px)" }}>
                      <MainContent isMedical />
                    </Content>

                    {/* {chat bot } */}
                    <ChatBot />

                    {/* Footer */}
                      <MHFooter />
                  </Layout>
                </Layout>
             {/* </MedicalProtectedRoute> */}
            </Provider>
          }
        />
        
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
