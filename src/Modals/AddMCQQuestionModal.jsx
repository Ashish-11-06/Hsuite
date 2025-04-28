import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Space, message, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addMCQQuestion, resetQuizState, getQuizByType } from "../Redux/Slices/mcqSlice";

const { Option } = Select;

const AddMCQQuestionModal = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { loading, error, success, quizzes } = useSelector((state) => state.mcq);
    const [form] = Form.useForm();
    const [questions, setQuestions] = useState([{
      question: "",
      options_1: "",
      options_2: "",
      options_3: "",
      options_4: "",
      correct_ans: [],
      type: "single-choice", // 'single-choice' or 'multiple-choice'
      quiz: null
    }]);
  
    // Fetch quizzes when modal opens
    useEffect(() => {
      if (open) {
        dispatch(getQuizByType('single-choice')); // Fetch quizzes based on default type
      }
    }, [open, dispatch]);
  
    const handleInputChange = (index, field, value) => {
        const updatedQuestions = [...questions];
      
        if (field === 'type' && value === 'single-choice' && updatedQuestions[index].correct_ans.length > 1) {
          updatedQuestions[index].correct_ans = [updatedQuestions[index].correct_ans[0]];
        }
      
        updatedQuestions[index][field] = value;
      
        if (field === 'type') {
          dispatch(getQuizByType(value));  // Fetch quizzes based on new question type
        }
      
        setQuestions(updatedQuestions);
      };
      
      useEffect(() => {
        if (error) {
          message.error(error);
          dispatch(resetQuizState());
          form.resetFields(); // Reset form fields if error occurs
        }
      }, [error, dispatch, form]);
      
  
      const handleSubmit = async () => {
        try {
            console.log("Starting submission...");
            // await form.validateFields(); // Ensure form is validated
            console.log("Form validation passed");
          
            const payload = questions.map((questionData) => {
              return {
                question: questionData.question,
                options_1: questionData.options_1,
                options_2: questionData.options_2,
                options_3: questionData.options_3,
                options_4: questionData.options_4,
                correct_ans: questionData.correct_ans, // Ensure the correct answer is passed as expected
                type: questionData.type, // The type of the question (single-choice or multiple-choice)
                quiz: questionData.quizId, // Ensure quizId is included and correctly mapped
              };
            });
          
            // Dispatching the action to add MCQ questions
            const result = await dispatch(addMCQQuestion(payload)); // Dispatching the action
            console.log("Dispatch result:", result);
            message.success("Questions added successfully!");
            handleClose(); // Close the modal after successful submission
          } catch (err) {
            console.error("Full submission error:", err);
            if (err?.response?.data) {
              console.error("Response error details:", err.response.data);
            }
            message.error(err.response?.data?.message || err.message || "Submission failed");
          }
          
      };
      
  
    const getFilteredQuizzes = (questionType) => {
      return quizzes.filter(quiz => 
        quiz.type === questionType
      );
    };
  
    const validateCorrectAnswers = (_, value, questionIndex) => {
        const question = questions[questionIndex];
        
        // Check if no correct answer is selected
        if (!value || value.length === 0) {
          return Promise.reject('Please select at least one correct answer');
        }
      
        // For single-choice, only one correct answer should be selected
        if (question.type === 'single-choice' && value.length > 1) {
          return Promise.reject('Single choice question can only have one correct answer');
        }
      
        // Get the available options for the question
        const availableOptions = [1, 2, 3, 4]
          .map(num => question[`options_${num}`])
          .filter(Boolean);  // Remove any empty options
      
        // Validate that the selected answers are part of the available options
        const invalidAnswers = value.filter(ans => !availableOptions.includes(ans));
      
        if (invalidAnswers.length > 0) {
          return Promise.reject(`Selected answers (${invalidAnswers.join(', ')}) don't match any options`);
        }
      
        return Promise.resolve();
      };
      
  
    const handleClose = () => {
      form.resetFields();
      setQuestions([{
        question: "",
        options_1: "",
        options_2: "",
        options_3: "",
        options_4: "",
        correct_ans: [],
        type: "single-choice",
        quizId: null
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
        type: "single-choice",
        quizId: null
      }]);
    };
  
    useEffect(() => {
      if (error) {
        message.error(error);
        dispatch(resetQuizState());
      }
    }, [error, dispatch]);

  return (
    <Modal 
      title="Add MCQ Questions" 
      open={open} 
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form form={form} layout="vertical">
        {questions.map((item, index) => (
          <div key={index} style={{ marginBottom: 24, borderBottom: '1px solid #f0f0f0', paddingBottom: 16 }}>
            
            <Form.Item
              label="Question Type"
              name={`type_${index}`}
              initialValue="single-choice"
            >
              <Radio.Group
                value={item.type}
                onChange={(e) => {
                  handleInputChange(index, 'type', e.target.value);
                  // Clear quiz selection when type changes
                  handleInputChange(index, 'quizId', null);
                }}
              >
                <Radio value="single-choice">Single Choice</Radio>
                <Radio value="multiple-choice">Multiple Choice</Radio>
              </Radio.Group>
            </Form.Item>

            {/* Quiz Selection Dropdown */}
            <Form.Item
              label="Select Quiz"
              name={`quiz_${index}`}
              rules={[{ required: true, message: 'Please select a quiz' }]}>
              <Select
                placeholder="Select a quiz"
                value={item.quizId}
                onChange={(value) => handleInputChange(index, 'quizId', value)}
                loading={loading}
              >
                {getFilteredQuizzes(item.type).map(quiz => (
                  <Option key={quiz.id} value={quiz.id}>
                    {quiz.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

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
                    key={`option_${num}_${index}`}
                    name={`option_${num}_${index}`}
                    rules={[{ required: num <= 2, message: `Option ${num} is required` }]}
                    noStyle
                  >
                    <Input
                      value={item[`options_${num}`]}
                      onChange={(e) => handleInputChange(index, `options_${num}`, e.target.value)}
                      placeholder={`Option ${num}`}
                      style={{ marginBottom: 8 }}
                    />
                  </Form.Item>
                ))}
              </Space>
            </Form.Item>

            <Form.Item
              label={`Correct Answer(s) (${item.type === 'single-choice' ? 'Select one' : 'Select multiple'})`}
              name={`correct_ans_${index}`}
              rules={[
                { 
                  validator: (_, value) => validateCorrectAnswers(_, value, index) 
                }
              ]}
            >
              <Select
                mode={item.type === 'single-choice' ? null : 'multiple'}
                placeholder="Select correct answers"
                value={item.correct_ans}
                onChange={(value) => {
                    const formattedValue = item.type === 'single-choice' ? [value] : value;
                    handleInputChange(index, 'correct_ans', formattedValue);
                  }}                  
              >
                {[1, 2, 3, 4].map((num) => {
                  const optionText = item[`options_${num}`];
                  return optionText ? (
                    <Option key={optionText} value={optionText}>
                      {optionText}
                    </Option>
                  ) : null;
                }).filter(Boolean)}
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