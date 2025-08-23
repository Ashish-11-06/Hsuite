import React, { useState } from "react";
import { Card, Row, Col, Typography, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import ActionModal from "../Modals/ActionModal"; // ✅ Import ActionModal
import { InfoCircleOutlined, PlusOutlined, FileDoneOutlined, BarChartOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Assessment = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("medicalRole");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTest, setCurrentTest] = useState("");
  const [actionModalVisible, setActionModalVisible] = useState(false); // ✅ Action modal state

  const testDescriptions = {
    personality: {
      title: "Personality Test",
      content: (
        <div>
          <p>
            The Personality Test helps you gain deeper insight into your psychological traits by analyzing your choices and preferences.
          </p>
          <p><strong>There are two types of personality tests:</strong></p>
          <ul>
            <li>
              <strong>Question-based:</strong> You will be presented with one question at a time along with four possible options. Select the option that best describes you.
            </li>
            <li>
              <strong>Statement-based:</strong> You will see pairs of statements or options, and you must choose one from each pair that resonates more with you.
            </li>
          </ul>
          <p>
            To take the test, select "Take Test" from the dropdown menu. You will then see the available tests — click on "Take Test" to begin. After completing the test, you will immediately see your results.
            To view your test history and all previous results, select "Report" from the dropdown menu.
          </p>
        </div>
      )
    },
    mcq: {
      title: "MCQ Test",
      content: (
        <div>
          <p>
            The MCQ Test measures your knowledge through carefully designed multiple-choice questions. Your score is based on the number of correct answers you select.
          </p>
          <p><strong>There are two types of MCQ tests:</strong></p>
          <ul>
            <li>
              <strong>Multiple-choice:</strong> You can select more than one answer if applicable, testing your comprehensive understanding.
            </li>
            <li>
              <strong>Single-choice:</strong> You must choose the one correct option that best answers the question.
            </li>
          </ul>
          <p>
            The questions often focus on medical knowledge or other specialized subjects, allowing you to test your expertise or skills in those areas.
          </p>
          <p>
            To take the test, select "Take Test" from the dropdown menu. You will then see the available tests — click on "Take Test" to begin. After completing the test, you will immediately see your results.
            To view your test history and all previous results, select "Report" from the dropdown menu.
          </p>
        </div>
      )
    },
    egogram: {
      title: "Egogram Test",
      content: (
        <div>
          <p>
            The Egogram Test analyzes your personality structure by asking you to rate a series of statements on a scale from 1 to 10.
          </p>
          <p>
            Each statement is accompanied by a slider for rating, where you indicate how strongly you agree or relate to it. This helps uncover different aspects of your personality.
          </p>
          <p>
            The results provide insights into your psychological categories and how they influence your behavior.
          </p>
          <p>
            To take the test, select "Take Test" from the dropdown menu. You will then see the available tests — click on "Take Test" to begin. After completing the test, you will immediately see your results.
            To view your test history and all previous results, select "Report" from the dropdown menu.
          </p>
        </div>
      )
    }
  };

  const showModal = (testType) => {
    setCurrentTest(testType);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const InfoIcon = ({ testType }) => (
    <InfoCircleOutlined
      style={{ marginLeft: 8, cursor: "pointer", color: "#1890ff" }}
      onClick={() => showModal(testType)}
    />
  );

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Assessments</Title>
      <Row gutter={[24, 24]}>
        {/* Personality Test */}
        <Col xs={24} md={8}>
          <Card
            title={
              <>
                Personality Test
                <InfoIcon testType="personality" />
              </>
            }
            bordered={false}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userRole === "admin" && (
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/medicalHealth/createset")}>
                  Create Set
                </Button>
              )}
              <Button
                icon={<FileDoneOutlined />}
                onClick={() => navigate("/medicalHealth/assessments")}>Take Test</Button>

              <Button
                icon={<BarChartOutlined />}
                onClick={() => navigate("/medicalHealth/report")}>View Report</Button>

            </div>
          </Card>
        </Col>

        {/* MCQ Test */}
        <Col xs={24} md={8}>
          <Card
            title={
              <>
                MCQ Test
                <InfoIcon testType="mcq" />
              </>
            }
            bordered={false}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userRole === "admin" && (
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/medicalHealth/createmcq")}>
                  Create MCQ
                </Button>
              )}
              <Button
                icon={<FileDoneOutlined />}
                onClick={() => navigate("/medicalHealth/mcqtest")}
              >Take Test
              </Button>

              <Button
                icon={<BarChartOutlined />}
                onClick={() => navigate("/medicalHealth/mcqreport")}>View Report</Button>
            </div>
          </Card>
        </Col>

        {/* Egogram Test */}
        <Col xs={24} md={8}>
          <Card
            title={
              <>
                Egogram Test
                <InfoIcon testType="egogram" />
              </>
            }
            bordered={false}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userRole === "admin" && (
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/medicalHealth/createegogram")}>
                  Create Egogram
                </Button>
              )}
              <Button icon={<FileDoneOutlined />} onClick={() => navigate("/medicalHealth/testegogram")}>Take Test</Button>
              <Button icon={<BarChartOutlined />} onClick={() => navigate("/medicalHealth/egogramreport")}>View Report</Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Actions Button */}
      {/* <div style={{ marginTop: 24, textAlign: "center" }}>
        <Button type="primary" onClick={() => setActionModalVisible(true)}>
          Actions
        </Button>
      </div> */}

      {/* Info Modal */}
      <Modal
        title={testDescriptions[currentTest]?.title || "Test Information"}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        {testDescriptions[currentTest]?.content || ""}
      </Modal>

      {/* Action Modal */}
      {/* <ActionModal
        visible={actionModalVisible}
        onClose={() => setActionModalVisible(false)}
        quizResult={null} // ✅ Replace with actual quiz result if needed
        userId={null} // ✅ Replace with actual user ID if needed
      /> */}
    </div>


  );
};

export default Assessment;