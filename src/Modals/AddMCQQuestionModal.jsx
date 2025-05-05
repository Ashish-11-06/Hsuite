import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Space, message, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addMCQQuestion, resetQuizState, getQuizByType } from "../Redux/Slices/mcqSlice";

const { Option } = Select;

const AddMCQQuestionModal = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { loading, error, success, quizzes } = useSelector((state) => state.mcq);
    const [form] = Form.useForm();
    
    // Separate state for quiz type and quiz selection
    const [quizType, setQuizType] = useState("single-choice");
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    
    // Questions state now only contains question-specific fields
    const [questions, setQuestions] = useState([{
      question: "",
      options_1: "",
      options_2: "",
      options_3: "",
      options_4: "",
      correct_ans: [],
    }]);

    // Fetch quizzes when modal opens or quizType changes
    useEffect(() => {
      if (open) {
        dispatch(getQuizByType(quizType));
      }
    }, [open, quizType, dispatch]);

    const handleInputChange = (index, field, value) => {
      const updatedQuestions = [...questions];
    
      if (field === 'correct_ans') {
        updatedQuestions[index][field] = Array.isArray(value)
          ? (quizType === 'single-choice' ? [value[0]] : value)
          : [value];
      } else {
        updatedQuestions[index][field] = value;
      }
    
      setQuestions(updatedQuestions);
    };
    
    

    useEffect(() => {
      if (error) {
        message.error(error);
        dispatch(resetQuizState());
      }
    }, [error, dispatch]);

    const handleSubmit = async () => {
      try {
        const payload = questions.map((q) => {
          // Map correct_ans values to option keys (if not already mapped)
          const correctAnsKeys = q.correct_ans.map((ans) => {
            if (ans === q.options_1) return 'options_1';
            if (ans === q.options_2) return 'options_2';
            if (ans === q.options_3) return 'options_3';
            if (ans === q.options_4) return 'options_4';
            return ans; // fallback (shouldn't happen if validation passed)
          });
    
          return {
            quiz: selectedQuiz,
            type: quizType,
            question: q.question,
            options_1: q.options_1,
            options_2: q.options_2,
            options_3: q.options_3,
            options_4: q.options_4,
            correct_ans: correctAnsKeys, // Store the keys, not values
          };
        });
    
        console.log("Final Payload ===>", payload); // Check the final payload
    
        await dispatch(addMCQQuestion(payload));
        message.success("Questions added successfully!");
        handleClose();
      } catch (err) {
        console.error("Submission error:", err);
        message.error(err.response?.data?.message || err.message || "Submission failed");
      }
    };
    
    
    const getFilteredQuizzes = () => {
      return Array.isArray(quizzes)
        ? quizzes.filter(quiz => quiz.type === quizType)
        : [];
    };    

    const validateCorrectAnswers = (_, value, questionIndex) => {
      const question = questions[questionIndex];
    
      if (!value || value.length === 0) {
        // return Promise.reject('Please select at least one correct answer');
      }
    
      if (quizType === 'single-choice' && value.length > 1) {
        // return Promise.reject('Single choice question can only have one correct answer');
      }
    
      const validKeys = ['options_1', 'options_2', 'options_3', 'options_4'];
      const invalidKeys = value.filter((key) => !validKeys.includes(key));
    
      if (invalidKeys.length > 0) {
        return Promise.reject(`Invalid keys selected: ${invalidKeys.join(', ')}`);
      }
    
      return Promise.resolve();
    };
    

    const handleClose = () => {
      form.resetFields();
      setQuizType("single-choice");
      setSelectedQuiz(null);
      setQuestions([{
        question: "",
        options_1: "",
        options_2: "",
        options_3: "",
        options_4: "",
        correct_ans: [],
      }]);
      dispatch(resetQuizState());
      onClose();
    };

    const addQuestion = () => {
      setQuestions([...questions, {
        question: "",
        options_1: "",
        options_2: "",
        options_3: "",
        options_4: "",
        correct_ans: [],
      }]);
    };

    return (
      <Modal 
        title="Add MCQ Questions" 
        open={open} 
        onCancel={onClose}
        footer={null}
        width={700}
        styles={{ body: { maxHeight: "60vh", overflowY: "auto" } }}
      >
        <Form form={form} layout="vertical">
          {/* Question Type - Only appears once at the top */}
          <Form.Item
            label="Question Type"
            name="type"
            initialValue="single-choice"
          >
            <Radio.Group
              value={quizType}
              buttonStyle="solid"
              onChange={(e) => {
                setQuizType(e.target.value);
                setSelectedQuiz(null); // Reset quiz selection when type changes
              }}
            >
              <Radio.Button value="single-choice">Single Choice</Radio.Button>
              <Radio.Button value="multiple-choice">Multiple Choice</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* Quiz Selection - Only appears once at the top */}
          <Form.Item
            label="Select Quiz"
            name="quiz"
            rules={[{ required: true, message: 'Please select a quiz' }]}
          >
            <Select
              placeholder="Select a quiz"
              value={selectedQuiz}
              onChange={setSelectedQuiz}
              loading={loading}
            >
              {Array.isArray(quizzes) && getFilteredQuizzes().map(quiz => (
                <Option key={quiz.id} value={quiz.id}>
                  {quiz.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Questions list */}
          {questions.map((item, index) => (
            <div key={index} style={{ marginBottom: 24 }}>
              <Form.Item
                label={`Question ${index + 1}`}
                name={`question_${index}`}
                rules={[{ required: true, message: 'Please enter the question' }]}
              >
                <Input
                  value={item.question}
                  onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                  placeholder="Enter your question"
                />
              </Form.Item>

              <Form.Item label="Options" required>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {[1, 2, 3, 4].map((num) => (
                    <Form.Item
                      key={`optionz_${num}_${index}`}
                      name={`optionz_${num}_${index}`}
                      rules={[{ required: num <= 2, message: `Optionz ${num} is required` }]}
                      noStyle
                    >
                      <Input
                        value={item[`options_${num}`]}
                        onChange={(e) => handleInputChange(index, `options_${num}`, e.target.value)}
                        placeholder={`Options ${num}`}
                        style={{ marginBottom: 8 }}
                      />
                    </Form.Item>
                  ))}
                </Space>
              </Form.Item>

<Form.Item
  label={`Correct Answer(s) (${quizType === 'single-choice' ? 'Select one' : 'Select up to 3'})`}
  name={`correct_ans_${index}`}
  extra={
    quizType === 'single-choice'
      ? 'Note: Single choice question can only have one correct answer.'
      : 'Note: Multiple choice question can select up to 3 correct answers.'
  }
>
  <Select
    mode={quizType === 'single-choice' ? null : 'multiple'}
    placeholder="Select correct answers"
    value={item.correct_ans}
    onChange={(value) => {
      if (quizType === 'single-choice') {
        handleInputChange(index, 'correct_ans', [value]); // Only one
      } else {
        // Allow up to 3 selections
        const limitedValue = value.slice(0, 3);
        handleInputChange(index, 'correct_ans', limitedValue);
      }
    }}
  >
    {[1, 2, 3, 4].map((num) => {
      const key = `options_${num}`;
      const label = item[key];
      return label ? (
        <Option key={key} value={key}>
          {label}
        </Option>
      ) : null;
    })}
  </Select>
</Form.Item>



            </div>
          ))}

          <Form.Item>
            <Button
              type="dashed"
              onClick={addQuestion}  
              style={{ width: "100%", marginBottom: "16px" }}
            >
              + Add Another Question
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              block
              htmlType="submit"
            >
              Submit Questions
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
};

export default AddMCQQuestionModal;