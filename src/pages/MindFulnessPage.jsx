import React from "react";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import "./MindfulnessPage.css";

const topics = [
  {
    title: "Sleep & Restfulness",
    description: [
      "Create a calming bedtime routine",
      "Body scan meditation for deep rest",
      "Release tension before sleep",
      "Breathing exercises to relax",
      "Limit screen time before bed"
    ],
    image:
      "https://media.post.rvohealth.io/wp-content/uploads/sites/3/2022/06/go_to_sleep_easily_732x549_thumb-732x549.jpg",
    videoUrl: "https://www.youtube.com/embed/DFEnruF-dts"
  },
  {
    title: "Overthinking Detox",
    description: [
      "Grounding techniques to stay present",
      "Journaling to clear mental clutter",
      "Mindful observation of one thought at a time",
      "Pause before reacting to situations",
      "Set specific ‘worry time’ limits"
    ],
    image:
      "https://cdn-ilbffbh.nitrocdn.com/KlZFioVYcrbsnbuHVuaGOnGVBtqRmadn/assets/images/optimized/rev-692bf8c/simipsychologicalgroup.com/wp-content/uploads/2024/02/man-thinking-1080x675.jpg",
    videoUrl: "https://www.youtube.com/embed/MH6uK2-ieb0"
  },
  {
    title: "Reframing Negative Thoughts",
    description: [
      "Challenge and reframe self-critical thoughts",
      "Practice loving-kindness meditation",
      "Use gratitude to shift perspective",
      "Observe patterns without judgment",
      "Repeat positive affirmations daily"
    ],
    image:
      "https://bayareacbtcenter.com/wp-content/uploads/2024/09/Untitled-design-358-1024x791.png",
    videoUrl: "https://www.youtube.com/embed/My3_Bmg88gE"
  },
  {
    title: "Mindful Breathing",
    description: [
      "Use slow breaths to calm your mind",
      "Box breathing for quick stress relief",
      "Alternate nostril breathing",
      "Focus on the rise and fall of breath",
      "Anchor attention to breathing rhythm"
    ],
    image:
      "https://media.post.rvohealth.io/wp-content/uploads/2019/02/Female_Sitting_Breathing_1200x628-facebook.jpg",
    videoUrl: "https://www.youtube.com/embed/v-w-vSvi-24"
  },
  {
    title: "Gratitude Awareness",
    description: [
      "Write down 3 things you're grateful for",
      "Practice gratitude before meals",
      "Appreciate small wins in daily life",
      "Express thanks to someone daily",
      "End the day with gratitude reflection"
    ],
    image:
      "https://images.squarespace-cdn.com/content/v1/656f4e4dababbd7c042c4946/a68505e0-92d3-4eb4-a9ce-f96c3776fb74/power-of-gratitude-3x2.jpg?w=600",
    videoUrl: "https://www.youtube.com/embed/RhuhLc69hF0"
  },
  {
    title: "Grounding in the Present",
    description: [
      "Focus on one sense at a time",
      "Observe surroundings without judgment",
      "Feel textures around you",
      "Listen to ambient sounds",
      "Mindfully walk outdoors"
    ],
    image:
      "https://stablemassage.com.au/wp-content/uploads/2020/06/grounding-exercise-1024x683.jpg?w=600",
    videoUrl: "https://www.youtube.com/embed/LLeqY9ingRY"
  }
];

const MindfulnessPage = () => {
  const navigate = useNavigate();

  const handleVideoClick = (videoUrl, title, description) => {
    navigate("/medicalHealth/mindvideo", { state: { videoUrl, title, description } });
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>
        Mindfulness!
      </h1>
      <Row gutter={[16, 16]}>
        {topics.map((topic, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <div
              className="card-container"
              onClick={() => handleVideoClick(topic.videoUrl, topic.title, topic.description)}
            >
              <Card
                hoverable
                bordered={false}
                cover={
                  <div className="image-container">
                    <img
                      alt={topic.title}
                      src={topic.image}
                      style={{
                        height: "250px",
                        objectFit: "cover",
                        width: "100%"
                      }}
                    />
                    <div className="overlay">
                      <ul>
                        {topic.description.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                }
              >
                <Card.Meta title={topic.title} />
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MindfulnessPage;
