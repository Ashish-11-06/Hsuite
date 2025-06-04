import React from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const WorkModal = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        onCreate(values);
      })
      .catch(info => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Create New Task"
      okText="Create"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical" name="work_task_form">
        <Form.Item
          name="task"
          label="Task"
          rules={[{ required: true, message: "Please enter the task" }]}
        >
          <Input placeholder="Enter task name or description" />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: "Please select priority" }]}
        >
          <Select placeholder="Select priority">
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true, message: "Please select deadline" }]}
        >
          <DatePicker
            showTime
            style={{ width: "100%" }}
            placeholder="Select date and time"
          />
        </Form.Item>

        {/* New group for 'How to serve the task' with text + priority */}
        <Form.Item
          label="How to serve the task"
          style={{ marginBottom: 0 }}
          required
        >
          <Form.Item
            name={["serve", "instructions"]}
            rules={[{ required: true, message: "Please provide instructions" }]}
            style={{ display: "inline-block", width: "70%", marginRight: 8 }}
          >
            <TextArea rows={3} placeholder="Instructions on handling the task" />
          </Form.Item>

          <Form.Item
            name={["serve", "priority"]}
            rules={[{ required: true, message: "Please select serve priority" }]}
            style={{ display: "inline-block", width: "28%" }}
          >
            <Select placeholder="Priority">
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WorkModal;
