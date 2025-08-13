import React, { useState } from "react";
import { Card, Row, Col, Modal, Button } from "antd";
import "./MindfulnessPage.css";

const topics = [
  {
    title: "Sleep & Restfulness",
    description: [
      "Mindful bedtime routines",
      "Body scan meditation for better sleep",
      "Letting go of “sleep pressure” anxiety",
      "Breathing exercises to relax before bed",
      "Digital detox for quality rest"
    ],
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600",
    videoUrl: "https://www.youtube.com/embed/ZToicYcHIOU"
  },
  {
    title: "Overthinking & Mental Clutter",
    description: [
      "Grounding techniques to stay present",
      "Journaling to clear your mind",
      "Mindful observation (focusing on one thing at a time)",
      "Learning to pause before reacting",
      "Setting “worry time” boundaries"
    ],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    videoUrl: "https://www.youtube.com/embed/5bJXj5R9QYk"
  },
  {
    title: "Negative Thoughts & Self-Talk",
    description: [
      "Reframing self-critical thoughts",
      "Loving-kindness meditation (Metta)",
      "Gratitude practice to shift focus",
      "Noticing thought patterns without judgment",
      "Affirmations rooted in mindfulness"
    ],
    image: "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?w=600",
    videoUrl: "https://www.youtube.com/embed/sZP2sGyoiE8"
  },
  {
    title: "Stress & Emotional Regulation",
    description: [
      "Mindful breathing for quick stress relief",
      "Labeling emotions instead of suppressing them",
      "Progressive muscle relaxation",
      "Using the 5 senses to anchor in the moment",
      "Mindful walking or movement"
    ],
    image: "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=600",
    videoUrl: "https://www.youtube.com/embed/inpok4MKVLM"
  },
  {
    title: "Everyday Mindfulness",
    description: [
      "Eating with awareness (mindful eating)",
      "Mindful listening in conversations",
      "Mindful mornings: starting your day with intention",
      "Nature mindfulness (outdoor meditation)",
      "Mindfulness at work to improve focus"
    ],
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
    videoUrl: "https://www.youtube.com/embed/SEfs5TJZ6Nk"
  },
  {
    title: "Grounding in the Present",
    description: [
      "Focusing on one sense at a time",
      "Observing surroundings without judgment",
      "Using touch to connect with the moment",
      "Listening to ambient sounds",
      "Mindful walking outdoors"
    ],
    image: "https://images.unsplash.com/photo-1500534314209-a26db0f5c7f9?w=600",
    videoUrl: "https://www.youtube.com/embed/x1sQkEfAdfY"
  }
];

export default function MindfulnessPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");

  const showVideo = (videoUrl, title) => {
    setSelectedVideo(videoUrl);
    setSelectedTitle(title);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedVideo(""); // pause video
    setSelectedTitle("");
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Mindfulness!</h1>
      <Row gutter={[16, 16]}>
        {topics.map((topic, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <div
              className="card-container"
              onClick={() => showVideo(topic.videoUrl, topic.title)}
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

      {/* Video Modal */}
      <Modal
        open={isModalVisible}
        onCancel={handleClose}
        footer={null}
        width={800}
        centered
        title={selectedTitle}
        destroyOnClose={true}
      >
        {selectedVideo && (
          <iframe
            width="100%"
            height="450"
            src={selectedVideo}
            title={selectedTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </Modal>
    </div>
  );
}
