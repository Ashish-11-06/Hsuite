import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Radio, message, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionsByType } from "../Redux/Slices/mcqSlice";
import AddMCQQuestionModal from "./AddMCQQuestionModal"; // Import the question modal

const { Option } = Select;

const AddMcqQuizModal = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [type, setQuizType] = useState("multiple-choice");
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false); // State for question modal

  const dispatch = useDispatch();
  const { questions, loading, error } = useSelector((state) => state.mcq);

  useEffect(() => {
    if (open) {
      dispatch(getQuestionsByType(type));
    }
  }, [dispatch, open, type]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleFinish = (values) => {
    const payload = {
       type,
      name: values.name,
      description: values.description,
      questions: values.questions,
    };
    console.log(payload);
    onSubmit(payload);
    form.resetFields();
  };  

  const handleQuizTypeChange = (e) => {
    const newType = e.target.value;
    setQuizType(newType);
    dispatch(getQuestionsByType(newType));
  };  

  const handleAddQuestion = () => {
    setIsQuestionModalOpen(true);
  };

  const handleQuestionModalClose = () => {
    setIsQuestionModalOpen(false);
    // Refresh questions after adding new ones
    dispatch(getQuestionsByType(type));
  };

  return (
    <>
      <Modal title="Add New Quiz" open={open} onCancel={onClose} footer={null}>
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item label="Quiz Type">
            <Radio.Group value={type} onChange={handleQuizTypeChange}>
              <Radio value="multiple-choice">Multiple Choice</Radio>
              <Radio value="single-choice">Single Choice</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="name"
            label="Quiz Name"
            rules={[{ required: true, message: "Please enter the quiz name" }]}
          >
            <Input placeholder="e.g. Programming Knowledge Test" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={4} placeholder="e.g. A basic quiz to test programming fundamentals." />
          </Form.Item>

          {/* <Form.Item
            name="questions"
            label="Select Questions"
            // rules={[{ required: true, message: "Please select at least one question" }]}
          >
            <Space.Compact style={{ width: '100%' }}>
              <Select
                mode="multiple"
                placeholder="Select questions"
                loading={loading}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toLowerCase()?.includes(input.toLowerCase())
                }
                style={{
                  width: 'calc(100% - 130px)', // Slightly adjusted for better gap
                  minHeight: '40px'
                }}
              >
                {Array.isArray(questions) && questions.map((q) => (
                  <Option key={q.id} value={q.id}>
                    {q.question}
                  </Option>
                ))}
              </Select>

              <Button 
                type="dashed" 
                onClick={handleAddQuestion}
                style={{
                  width: '120px',
                  minHeight: '40px'
                }}
              >
                + Add
              </Button>
            </Space.Compact>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit Quiz
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Question Modal */}
      <AddMCQQuestionModal 
        open={isQuestionModalOpen} 
        onClose={handleQuestionModalClose} 
      />
    </>
  );
};

export default AddMcqQuizModal;