import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message as antdMessage, Select, Input, Button, List, Radio } from "antd";
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

  const [quizType, setQuizType] = useState("question-based");
  const [formData, setFormData] = useState([{
    quiz_id: null,
    question: "",
    option_1: "",
    option_2: "",
    option_3: "",
    option_4: ""
  }]);

  // Filter quiz list based on selected type
  const filteredQuizList = quizList?.filter(quiz => 
    quiz.type === quizType || quiz.quiz_type === quizType
  );

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

  useEffect(() => {
    dispatch(getQuizCategories(quizType));
  }, [dispatch, quizType]);

  useEffect(() => {
    if (formData[0]?.quiz_id) {
      dispatch(getTestQuestions(formData[0]?.quiz_id));
    }
  }, [formData, dispatch]);

  useEffect(() => {
    if (questionSuccess) {
      antdMessage.success("Saved successfully!");
      resetForm();
      dispatch(resetQuestionState());
      onSuccess();
    }
    if (questionError) {
      antdMessage.error(questionError.message || "Failed to save");
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
    const updatedFormData = formData.map(item => ({
      ...item,
      quiz_id: quizId
    }));
    setFormData(updatedFormData);
  };

  const resetForm = () => {
    setFormData([{
      quiz_id: formData[0]?.quiz_id || null,
      question: "",
      option_1: "",
      option_2: "",
      option_3: "",
      option_4: ""
    }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData[0]?.quiz_id) {
      antdMessage.error("Please select a quiz");
      return;
    }

    const payload = formData.map(item => ({
      quiz_id: item.quiz_id,
      question: quizType === "question-based" ? item.question : null,
      option_1: item.option_1,
      option_2: item.option_2,
      option_3: item.option_3,
      option_4: item.option_4
    }));

    // Validate all fields are filled
    const isValid = formData.every(item =>
      item.option_1 && item.option_2 && item.option_3 && item.option_4
    );

    if (!isValid) {
      antdMessage.error("All four options are required.");
      return;
    }

    try {
      await dispatch(createTestQuestion(payload)).unwrap();
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const selectedQuizName = filteredQuizList?.find(q => q.id === formData[0]?.quiz_id)?.quiz_name || "";

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
      {/* <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>Select Quiz Type:</label>
        <Radio.Group 
          onChange={(e) => setQuizType(e.target.value)} 
          value={quizType}
          style={{ marginBottom: "16px" }}
        >
          <Radio value="question-based">Question-Based</Radio>
          <Radio value="statement-based">Statement-Based</Radio>
        </Radio.Group>
      </div> */}

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>Select Quiz:</label>
        <Select
          showSearch
          style={{ width: "100%", marginBottom: "16px" }}
          placeholder={quizLoading ? "Loading quizzes..." : "Select a quiz"}
          loading={quizLoading}
          value={formData[0]?.quiz_id}
          onChange={handleQuizSelect}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {filteredQuizList?.map((quiz) => (
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
          {quizType === "question-based" && (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                Question {index + 1}:
              </label>
              <Input
                name="question"
                value={item.question}
                onChange={(e) => handleChange(index, e)}
                placeholder="Enter your question"
                required
              />
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Options:
            </label>
            <Input
              name="option_1"
              value={item.option_1}
              onChange={(e) => handleChange(index, e)}
              placeholder="Option 1 (Required)"
              required
            />
            <Input
              name="option_2"
              value={item.option_2}
              onChange={(e) => handleChange(index, e)}
              placeholder="Option 2 (Required)"
              required
              style={{ marginTop: 8 }}
            />
            <Input
              name="option_3"
              value={item.option_3}
              onChange={(e) => handleChange(index, e)}
              placeholder="Option 3 (Required)"
              // required
              style={{ marginTop: 8 }}
            />
            <Input
              name="option_4"
              value={item.option_4}
              onChange={(e) => handleChange(index, e)}
              placeholder="Option 4 (Required)"
              // required
              style={{ marginTop: 8 }}
            />
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
        disabled={
          !formData[0]?.quiz_id || 
          formData.some(item => !item.option_1 || !item.option_2 || !item.option_3 || !item.option_4)
        }
        style={{ width: "100%" }}
      >
        {questionLoading ? "Submitting..." : "Submit"}
      </Button>

      {testQuestions?.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <h3>Existing Questions:</h3>
          <List
            itemLayout="horizontal"
            dataSource={testQuestions}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  title={`${index + 1}. ${item.question}`}
                  description={
                    <>
                      <div>1. {item.option_1}</div>
                      <div>2. {item.option_2}</div>
                      {item.option_3 && <div>3. {item.option_3}</div>}
                      {item.option_4 && <div>4. {item.option_4}</div>}
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </form>
  );
};

export default Test;
