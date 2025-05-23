import React, { useState } from "react";
import { Button, Row, Col, Card, Typography } from "antd";
import WorkModal from "../Modals/WorkModal";

const { Text } = Typography;

const WorkOrganisation = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Determine urgency by deadline closeness (within 24 hrs = high)
  const getUrgency = (deadline) => {
    const now = new Date();
    const dl = new Date(deadline);
    const diffMs = dl - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours <= 24) return "high";
    return "low";
  };

  // Combine task priority and serve priority for importance, ignoring medium
  const getImportance = (taskPriority, servePriority) => {
    if (taskPriority === "high" || servePriority === "high") return "high";
    return "low"; // medium is treated as low here
  };

  const onCreateTask = (taskData) => {
    const urgency = getUrgency(taskData.deadline);
    const importance = getImportance(taskData.priority, taskData.serve.priority);

    const newTask = {
      key: Date.now(),
      task: taskData.task,
      priority: taskData.priority,
      deadline: taskData.deadline,
      urgency,
      importance,
      instructions: taskData.serve.instructions,
      servePriority: taskData.serve.priority,
    };

    setTasks(prev => [...prev, newTask]);
    setModalVisible(false);
  };

  const filterTasks = (urgency, importance) =>
    tasks.filter(t => t.urgency === urgency && t.importance === importance);

  const renderTasks = (tasksList) =>
    tasksList.length ? (
      tasksList.map(t => (
        <Card
          key={t.key}
          size="small"
          style={{ marginBottom: 8 }}
          type="inner"
          title={t.task}
        >
          <Text strong>Task Priority:</Text> {t.priority} <br />
          <Text strong>Serve Priority:</Text> {t.servePriority} <br />
          <Text strong>Deadline:</Text> {new Date(t.deadline).toLocaleString()} <br />
          <Text strong>Instructions:</Text> {t.instructions}
        </Card>
      ))
    ) : (
      <Text type="secondary">No tasks</Text>
    );

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Create Task
      </Button>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Highly Urgent & Highly Important" bordered>
            {renderTasks(filterTasks("high", "high"))}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Highly Urgent & Less Important" bordered>
            {renderTasks(filterTasks("high", "low"))}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Less Urgent & Highly Important" bordered>
            {renderTasks(filterTasks("low", "high"))}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Less Urgent & Less Important" bordered>
            {renderTasks(filterTasks("low", "low"))}
          </Card>
        </Col>
      </Row>

      <WorkModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onCreate={onCreateTask}
      />
    </div>
  );
};

export default WorkOrganisation;
