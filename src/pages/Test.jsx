import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message as antdMessage, Select, Input, Button, List } from "antd";
import { getQuizCategories, createTestQuestion, resetQuestionState, getTestQuestions } from "../Redux/Slices/quizSlice";

const { Option } = Select;

const Test = ({ onSuccess, selectedQuizId }) => {
  const dispatch = useDispatch();
  const { 
    quizList, 
    loading: quizLoading,
    questionLoading,
    questionError,
    questionSuccess,
    testQuestions, 
  } = useSelector((state) => state.quiz);

  const [formData, setFormData] = useState([{
    quiz_id: null,
    question: "",
    option_1: "",
    option_2: "",
    option_3: "",
    option_4: ""
  }]);

  useEffect(() => {
    if (selectedQuizId) {
      const updatedFormData = formData.map(item => ({
        ...item,
        quiz_id: selectedQuizId
      }));
      setFormData(updatedFormData);
      dispatch(getTestQuestions(selectedQuizId));
    }
  }, [selectedQuizId, dispatch]);
  

  // Fetch quizzes and questions when component mounts
  useEffect(() => {
    dispatch(getQuizCategories());
  }, [dispatch]);

  useEffect(() => {
    if (formData[0]?.quiz_id) {
      dispatch(getTestQuestions(formData[0]?.quiz_id)); // Fetch test questions when a quiz is selected
    }
  }, [formData, dispatch]);

  // Handle API success/error messages
  useEffect(() => {
    if (questionSuccess) {
      antdMessage.success("Questions added successfully!");
      resetForm();
      dispatch(resetQuestionState());
      onSuccess();
    }
    if (questionError) {
      antdMessage.error(questionError.message || "Failed to add questions");
      dispatch(resetQuestionState());
    }
  }, [questionSuccess, questionError, dispatch, onSuccess]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index] = { ...updatedFormData[index], [name]: value };
    setFormData(updatedFormData);
  };

  const handleQuizSelect = (quizId) => {
    const updatedFormData = [...formData];
    updatedFormData.forEach(item => {
      item.quiz_id = quizId;
    });
    setFormData(updatedFormData);
  };

  const resetForm = () => {
    setFormData([{
      quiz_id: formData[0]?.quiz_id || null, // Keep the same quiz selected
      question: "",
      option_1: "",
      option_2: "",
      option_3: "",
      option_4: ""
    }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData[0].quiz_id) {
      antdMessage.error("Please select a quiz");
      return;
    }

    const validQuestions = formData.filter(
      item => item.question && item.option_1 && item.option_2
    );
    if (validQuestions.length === 0) {
      antdMessage.error("Please fill in at least one valid question with 2 options");
      return;
    }

    try {
      await dispatch(createTestQuestion(validQuestions)).unwrap(); // Send all questions at once
    } catch (err) {
      // Error handled by useEffect
    }
  };

  const selectedQuizName = quizList?.find(q => q.id === formData[0]?.quiz_id)?.quiz_name || "";

  const addQuestion = () => {
    setFormData([...formData, {
      quiz_id: formData[0]?.quiz_id || null,
      question: "",
      option_1: "",
      option_2: "",
      option_3: "",
      option_4: ""
    }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "16px" }}>
        <label>Select Quiz:</label>
        <Select
          showSearch
          style={{ width: "100%", marginTop: "8px" }}
          placeholder={quizLoading ? "Loading quizzes..." : "Select a quiz"}
          loading={quizLoading}
          value={formData[0]?.quiz_id}
          onChange={handleQuizSelect}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {quizList?.map((quiz) => (
            <Option key={quiz.id} value={quiz.id}>
              {quiz.quiz_name}
            </Option>
          ))}
        </Select>
        {formData[0]?.quiz_id && (
          <p style={{ marginTop: "4px", color: "#666" }}>
            Selected Quiz: <strong>{selectedQuizName}</strong>
          </p>
        )}
      </div>

      {formData.map((item, index) => (
        <div key={index}>
          <div style={{ marginBottom: "16px" }}>
            <label>Question: {index + 1}</label>
            <Input
              name="question"
              value={item.question}
              onChange={(e) => handleChange(index, e)}
              placeholder="Enter your question"
              style={{ width: "100%", marginTop: "8px" }}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Options:</label>
            {[1, 2, 3, 4].map((num) => (
              <div key={num} style={{ marginTop: "8px" }}>
                <Input
                  name={`option_${num}`}
                  value={item[`option_${num}`]}
                  onChange={(e) => handleChange(index, e)}
                  placeholder={`Option ${num}${num > 2 ? '' : ''}`}
                  style={{ width: "100%" }}
                  required={num <= 2}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button
        type="dashed"
        onClick={addQuestion}  
        style={{ width: "100%", marginBottom: "16px" }}
      >
        + Add Another Question
      </Button>

      <Button
        type="primary"
        htmlType="submit"
        loading={questionLoading}
        disabled={!formData[0]?.quiz_id || formData.some(item => !item.question || !item.option_1 || !item.option_2)}
        style={{ width: "100%" }}
      >
        {questionLoading ? "Submitting..." : "Add Questions"}
      </Button>

      {/* Display Test Questions for the selected Quiz */}
      {testQuestions?.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <h3>Existing Questions for "{selectedQuizName}":</h3>
          <List
            itemLayout="vertical"
            dataSource={testQuestions}
            renderItem={(question, index) => (
              <List.Item key={question.id}>
                <h4>{index+1}.{question.question}</h4>
                <p>{question.option_1}</p>
                <p>{question.option_2}</p>
                <p>{question.option_3}</p>
                <p>{question.option_4}</p>
              </List.Item>
            )}
          />
        </div>
      )}
    </form>
  );
};

export default Test;
