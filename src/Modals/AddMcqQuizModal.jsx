import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Radio, message, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionsByType } from "../Redux/Slices/mcqSlice";
import AddMCQQuestionModal from "./AddMCQQuestionModal";

const { Option } = Select;

const AddMcqQuizModal = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [type, setQuizType] = useState("multiple-choice");
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { questions, loading, error } = useSelector((state) => state.mcq);

  useEffect(() => {
    if (open) {
      dispatch(getQuestionsByType(type));
      form.resetFields();
    }
  }, [dispatch, open, type, form]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleFinish = (values) => {
    // Get the full question objects for selected IDs
    const selectedQuestions = questions.filter(q => 
      values.questions?.includes(q.id)
    ).map(q => ({
      question: q.question,
      options_1: q.options_1,
      options_2: q.options_2,
      options_3: q.options_3,
      options_4: q.options_4,
      correct_ans: q.correct_ans
    }));

    const payload = {
      type,
      name: values.name,
      description: values.description,
      questions: selectedQuestions,
    };

    console.log("Submitting payload:", payload);
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
    dispatch(getQuestionsByType(type));
  };

  return (
    <>
      <Modal 
        title="Add New Quiz" 
        open={open} 
        onCancel={onClose} 
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          initialValues={{ questions: [] }}
        >
          <Form.Item label="Quiz Type">
            <Radio.Group 
              value={type} 
              onChange={handleQuizTypeChange}
              buttonStyle="solid"
            >
              <Radio.Button value="single-choice">Single Choice</Radio.Button>
              <Radio.Button value="multiple-choice">Multiple Choice</Radio.Button>
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
            <Input.TextArea 
              rows={4} 
              placeholder="e.g. A basic quiz to test programming fundamentals." 
            />
          </Form.Item>

          <Form.Item
            name="questions"
            label="Select Questions"
          >
            <Space.Compact style={{ width: '100%' }}>
              <Select
                mode="multiple"
                placeholder="Select questions"
                loading={loading}
                optionFilterProp="children"
                showSearch
                style={{ width: '100%' }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                onChange={(selected) => {
                  form.setFieldsValue({ questions: selected });
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
                style={{ width: 150 }}
              >
                + Add Question
              </Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              size="large"
            >
              Create Quiz
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <AddMCQQuestionModal 
        open={isQuestionModalOpen} 
        onClose={handleQuestionModalClose} 
      />
    </>
  );
};

export default AddMcqQuizModal;