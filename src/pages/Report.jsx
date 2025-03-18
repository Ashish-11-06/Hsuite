import React, { useEffect, useState } from "react";
import { Card, Spin, Alert } from "antd";
import { getUserResults } from "../Redux/API/assessmentapi";

const Report = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserHistory();
  }, []);

  const fetchUserHistory = async () => {
    setLoading(true);
    try {
      const { data } = await getUserResults(userId);
      setHistory(data);
    } catch (err) {
      setError("Error fetching assessment history.");
    }
    setLoading(false);
  };

  if (loading) return <Spin tip="Loading assessment history..." />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Assessment History</h2>
      {history.length > 0 ? (
        history.map((assessment, index) => (
          <Card key={index} style={{ marginBottom: 10 }}>
            <p><strong>Date:</strong> {new Date(assessment.date).toLocaleString()}</p>
            <p><strong>Primary Trait:</strong> {Object.keys(assessment.scores)[0] || "Unknown"}</p>
            {Object.entries(assessment.scores).map(([trait, percentage]) => (
              <p key={trait}>{trait}: {percentage}%</p>
            ))}
          </Card>
        ))
      ) : (
        <p>No past assessments found.</p>
      )}
    </div>
  );
};

export default Report;
