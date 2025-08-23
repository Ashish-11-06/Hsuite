// src/Components/MHHome.jsx
import React from "react";
import { Layout } from "antd";
import Hero from "./MHHomepages/Hero.jsx";
import StartAndFind from "./MHHomepages/StartAndFind.jsx";
import AssessmentsOverview from "./MHHomepages/AssessmentsOverview.jsx";
import FeaturedCounsellors from "./MHHomepages/FeaturedCounsellors.jsx";
import CallToAction from "./MHHomepages/CallToAction.jsx";
import MHFooter from "./MHFooter.jsx";

const { Content } = Layout;

const MHHome = () => {
  return (
    <Layout style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* ✅ Background Image for the entire page */}
      {/* <img
        src="/hero.jpg"
        alt="Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(5px) brightness(60%)", // global blur + dark
          zIndex: 0,
        }}
      /> */}

      {/* ✅ Foreground Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Hero />   {/* Hero component now only has the slogan */}
        <Content style={{ padding: "20px" }}>
          <StartAndFind />
          <AssessmentsOverview />
          <FeaturedCounsellors />
          <CallToAction />
        </Content>
        {/* <MHFooter /> */}
      </div>
    </Layout>
  );
};

export default MHHome;
