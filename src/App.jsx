import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";
import HeaderComponent from "./Components/HeaderComponent.jsx";
import FooterComponent from "./components/FooterComponent.jsx";
import MainContent from "./components/MainContent.jsx";
import Sidebar from "./components/Sidebar.jsx"; 
import "./App.css";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Use the Sidebar component */}
        <Sidebar />

        <Layout>
          {/* Header */}
          <Header>
            <HeaderComponent />
          </Header>

          {/* Main Content */}
          <Content style={{ padding: "20px" }}>
            <MainContent />
          </Content>

          {/* Footer */}
          <Footer>
            <FooterComponent />
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;