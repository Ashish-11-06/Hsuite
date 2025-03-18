import React, { useEffect, useState } from "react";
import { getUserResults } from "../Redux/API/assessmentapi";
import { Card, Button, Modal } from "antd";

const Results = ({ userId }) => {
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchResults();
    }
  }, [userId]);

  const traitMapping = {
    "Logical analysis": "Logical",
    "Creative thinking": "Creative",
    "Following a structured plan": "Analytical",
    "Trial and error": "Spontaneous",
    "Data-driven": "Logical",
    "Intuitive": "Creative",
    "Consensus-based": "Collaborative",
    "Spontaneous": "Spontaneous",
    "Helping others": "Empathetic",
    "Group discussions": "Collaborative",
    "I prefer working alone and focusing deeply.": "Introverted",
    "I enjoy collaborating and brainstorming with others.": "Extroverted",
    "Efficiency and order.": "Organized",
    "Creativity and freedom.": "Creative",
    "I analyze and break it down logically.": "Logical",
    "I am highly organized.": "Organized",
    "I am spontaneous and adventurous.": "Spontaneous",
  };

  const fetchResults = async () => {
    try {
      const { data } = await getUserResults(userId);

      if (data.length > 0) {
        setHistory(data); // Store all past assessments
        const latestResult = data[data.length - 1];
        const scores = calculateScores(latestResult.responses || []);
        
        const dominantTrait = Object.entries(scores).reduce(
          (maxTrait, [trait, percentage]) =>
            percentage > scores[maxTrait] ? trait : maxTrait,
          Object.keys(scores)[0] || "Unknown"
        );

        setResults({
          latestResult,
          scores,
          summary: `Your dominant trait is ${dominantTrait}.`,
        });
      } else {
        setResults({ scores: {} }); // Set empty object to prevent errors
      }
    } catch (error) {
      console.error("❌ Error fetching results:", error);
    }
  };

  const calculateScores = (responses) => {
    let scores = {};

    responses.forEach(({ selectedOption }) => {
      let trait = traitMapping[selectedOption];
      if (trait) {
        scores[trait] = (scores[trait] || 0) + 1;
      }
    });

    const totalResponses = Object.values(scores).reduce((sum, val) => sum + val, 0);
    let normalizedScores = {};

    if (totalResponses > 0) {
      Object.keys(scores).forEach((trait) => {
        normalizedScores[trait] = Math.round((scores[trait] / totalResponses) * 100);
      });

      const totalPercentage = Object.values(normalizedScores).reduce((sum, val) => sum + val, 0);
      if (totalPercentage !== 100) {
        let maxTrait = Object.keys(normalizedScores).reduce((a, b) =>
          normalizedScores[a] > normalizedScores[b] ? a : b
        );
        normalizedScores[maxTrait] += 100 - totalPercentage; 
      }
    }

    return normalizedScores;
  };

  return (
    <Card title="Assessment Results">
      {results && Object.keys(results.scores || {}).length > 0 ? (
        <>
          <p><strong>Primary Trait:</strong> {Object.keys(results.scores)[0] || "Unknown"}</p>
          {Object.entries(results.scores).map(([trait, percentage]) => (
            <p key={trait}>{trait}: {percentage}%</p>
          ))}
          <p>{results.summary}</p>
        </>
      ) : (
        <p>No results available.</p>
      )}

      <Button 
        onClick={() => setIsHistoryModalOpen(true)} 
        type="primary" 
        style={{ marginTop: 10, display: "block" }}
      >
        View History
      </Button>

      {/* History Modal */}
      <Modal
        title="Past Assessments"
        open={isHistoryModalOpen}
        onCancel={() => setIsHistoryModalOpen(false)}
        footer={null}
      >
        {history.length > 0 ? (
          history.map((assessment, index) => (
            <Card key={index} style={{ marginBottom: 10 }}>
              <p><strong>Date:</strong> {new Date(assessment.date).toLocaleDateString()}</p>
              <p><strong>Primary Trait:</strong> {Object.keys(assessment.scores || {})[0] || "Unknown"}</p>
              {Object.entries(assessment.scores || {}).map(([trait, percentage]) => (
                <p key={trait}>{trait}: {percentage}%</p>
              ))}
            </Card>
          ))
        ) : (
          <p>No past assessments found.</p>
        )}
      </Modal>
    </Card>
  );
};

export default Results;
