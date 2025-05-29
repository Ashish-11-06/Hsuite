import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"; 
import { Layout } from "antd";
import HeaderComponent from "./Components/HeaderComponent.jsx";
import FooterComponent from "./Components/FooterComponent.jsx";
import MainContent from "./Components/MainContent.jsx";
import "./App.css";
import Login from "./pages/Login.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import { useEffect } from "react";

const { Header, Content, Footer } = Layout;

// New component to handle inactivity logout using navigate inside Router
function InactivityHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // const EXPIRY_HOURS = 24;
    // const EXPIRY_MS = EXPIRY_HOURS * 60 * 60 * 1000; //24 hrs
    const EXPIRY_MS = 1 * 60 * 1000; // 1 minute in milliseconds
    console.log("App component mounted, setting up localStorage expiry check");
    console.log('expiry in ms:', EXPIRY_MS);

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
          localStorage.clear(); // or selectively remove items
          // console.log('localStorage cleared due to 24h inactivity');
          // navigate....................................
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

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
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
        <Route path="/login" element={<Login />}/>

        <Route
          path="*"
          element={
            <ProtectedRoute>
            <Layout style={{ minHeight: "100vh", display: "flex" }}>
              {/* Sidebar */}
              <Sidebar style={{ width: "250px", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0, right: 0 }} />

              <Layout style={{  display: "flex", flexDirection: "column", height: "100vh" }}>
                {/* Header */}
                <Header style={{ position: "fixed", top: 0, left: "200px", right: 0, height: "65px", zIndex: 100 }}>
                  <HeaderComponent />
                </Header>

                {/* Main Content */}
                <Content style={{ marginTop: "60px", padding: "30px", overflowY: "auto", flexGrow: 1, height: "calc(100vh - 60px)" }}>
                  <MainContent />
                </Content>

                {/* Footer */}
                {/* <Footer style={{ textAlign: "center", position: "fixed", bottom: 0, left: "250px", right: 0 }}>
                  <FooterComponent />
                </Footer> */}
              </Layout>
            </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
