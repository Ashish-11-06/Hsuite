import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import { Layout } from "antd";
import HeaderComponent from "./Components/HeaderComponent.jsx";
import FooterComponent from "./components/FooterComponent.jsx";
import MainContent from "./components/MainContent.jsx";
import "./App.css";
import Login from "./pages/Login.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
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
                <Footer style={{ textAlign: "center", position: "fixed", bottom: 0, left: "250px", right: 0 }}>
                  <FooterComponent />
                </Footer>
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
