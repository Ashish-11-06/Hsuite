import React, { useState } from "react";
import { useDispatch } from "react-redux";
import QuizList from "./QuizList";
import BasedQuestions from "./Basedquestions";

const Assessments = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("quiz");

  const containerStyle = {
    padding: "20px",
    backgroundColor: "#f0f8ff",
    borderRadius: "12px",
    maxWidth: "700px",
    margin: "20px auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const headingStyle = {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const listStyle = {
    fontSize: "16px",
    lineHeight: "1.8",
    paddingLeft: "20px",
    color: "#333",
  };

  return (
    <div >
      <div style={containerStyle}>
        <h2 style={headingStyle}>Assessments</h2>

        <ul style={listStyle}>
          <li>The test consists of 20 questions.</li>
          <li>Each question has a timer of 10 seconds.</li>
          <li>Each question has 4 options, and only one answer should be chosen.</li>
          <li>At the end of the test, results will be shown.</li>
          <li>You can retake the test if you want.</li>
        </ul>
        {/* <BasedQuestions /> */}
      </div>
      {/* Show QuizList component */}
      {activeTab === "quiz" && <QuizList />}
    </div>
  );
};

export default Assessments;
