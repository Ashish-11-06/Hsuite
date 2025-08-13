import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message as antdMessage, Select, Input, Button, List, Radio, Tooltip } from "antd";
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

  // Get the selected quiz to access its categories
  const selectedQuiz = quizList?.find(quiz => quiz.id === formData[0]?.quiz_id);
  const categoryNames = selectedQuiz ? [
    selectedQuiz.category_1,
    selectedQuiz.category_2,
    selectedQuiz.category_3,
    selectedQuiz.category_4
  ].filter(Boolean) : [];

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
      antdMessage.success("Quiz questions created successfully");
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

  const countFilledOptions = (item) => {
    return [item.option_1, item.option_2, item.option_3, item.option_4]
      .filter(opt => opt && opt.trim()).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData[0]?.quiz_id) {
      antdMessage.error("Please select a quiz");
      return;
    }

    // Different validation for question-based vs statement-based
    if (quizType === "question-based") {
      const isValid = formData.every(item =>
        item.question && item.option_1 && item.option_2 && item.option_3 && item.option_4
      );
      if (!isValid) {
        antdMessage.error("All fields including question and four options are required.");
        return;
      }
    } else { // statement-based
      const hasInvalidItems = formData.some(item => {
        const filledCount = countFilledOptions(item);
        return filledCount !== 2; // Must have exactly 2 options filled
      });

      if (hasInvalidItems) {
        antdMessage.error("For statement-based quizzes, please fill exactly two options.");
        return;
      }
    }

    const payload = formData.map(item => {
      if (quizType === "question-based") {
        return {
          quiz_id: item.quiz_id,
          question: item.question,
          option_1: item.option_1,
          option_2: item.option_2,
          option_3: item.option_3,
          option_4: item.option_4
        };
      } else {
        // For statement-based, find which two options are filled
        const filledOptions = [
          { name: "option_1", value: item.option_1 },
          { name: "option_2", value: item.option_2 },
          { name: "option_3", value: item.option_3 },
          { name: "option_4", value: item.option_4 }
        ].filter(opt => opt.value && opt.value.trim());

        // Create payload with the two filled options in their original positions
        return {
          quiz_id: item.quiz_id,
          question: null,
          option_1: filledOptions.find(opt => opt.name === "option_1")?.value || null,
          option_2: filledOptions.find(opt => opt.name === "option_2")?.value || null,
          option_3: filledOptions.find(opt => opt.name === "option_3")?.value || null,
          option_4: filledOptions.find(opt => opt.name === "option_4")?.value || null
        };
      }
    });

    try {
      await dispatch(createTestQuestion(payload)).unwrap();
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const disabledCondition =
    !formData[0]?.quiz_id || formData.some(item => countFilledOptions(item) !== 2);

  const disabledCondition2 =
    !formData[0]?.quiz_id || formData.some(item => countFilledOptions(item) !== 4);


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
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>Select Quiz Type:</label>
        <Radio.Group
          onChange={(e) => setQuizType(e.target.value)}
          value={quizType}
          style={{ marginBottom: "16px" }}
        >
          <Radio value="question-based">Question-Based</Radio>
          <Radio value="statement-based">Statement-Based</Radio>
        </Radio.Group>
      </div>

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
              {quizType === "statement-based" && (
                <span style={{ color: "#666", marginLeft: "8px", fontSize: "0.9em" }}>
                  (Fill exactly two options)
                </span>
              )}
            </label>
            <Input
              name="option_1"
              value={item.option_1}
              onChange={(e) => handleChange(index, e)}
              placeholder={
                quizType === "statement-based" && categoryNames[0]
                  ? categoryNames[0]
                  : "Option 1"
              }
              style={{ marginBottom: 8 }}
            />
            <Input
              name="option_2"
              value={item.option_2}
              onChange={(e) => handleChange(index, e)}
              placeholder={
                quizType === "statement-based" && categoryNames[1]
                  ? categoryNames[1]
                  : "Option 2"
              }
              style={{ marginBottom: 8 }}
            />
            <Input
              name="option_3"
              value={item.option_3}
              onChange={(e) => handleChange(index, e)}
              placeholder={
                quizType === "statement-based" && categoryNames[2]
                  ? categoryNames[2]
                  : "Option 3"
              }
              style={{ marginBottom: 8 }}
            />
            <Input
              name="option_4"
              value={item.option_4}
              onChange={(e) => handleChange(index, e)}
              placeholder={
                quizType === "statement-based" && categoryNames[3]
                  ? categoryNames[3]
                  : "Option 4"
              }
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

      {quizType === "statement-based" ? (
        disabledCondition ? (
          // Show Tooltip only when button is disabled
          <Tooltip title="To submit, add exactly 2 options" color="#008dce" placement="top">
            <Button
              type="primary"
              htmlType="submit"
              loading={questionLoading}
              disabled={true}
              style={{ width: "100%" }}
            >
              {questionLoading ? "Submitting..." : "Submit"}
            </Button>
          </Tooltip>
        ) : (
          <Button
            type="primary"
            htmlType="submit"
            loading={questionLoading}
            disabled={false}
            style={{ width: "100%" }}
          >
            {questionLoading ? "Submitting..." : "Submit"}
          </Button>
        )
      ) : (
        disabledCondition2 ? (
          // Show Tooltip only when button is disabled
          <Tooltip title="To submit, add question and all the options" color="#008dce" placement="top">
            <Button
              type="primary"
              htmlType="submit"
              loading={questionLoading}
              disabled={
                !formData[0]?.quiz_id ||
                formData.some(
                  item =>
                    !item.question ||
                    !item.option_1 ||
                    !item.option_2 ||
                    !item.option_3 ||
                    !item.option_4
                )
              }
              style={{ width: "100%" }}
            >
              {questionLoading ? "Submitting..." : "Submit"}
            </Button>
          </Tooltip>
        ) : (
          <Button
            type="primary"
            htmlType="submit"
            loading={questionLoading}
            disabled={
              !formData[0]?.quiz_id ||
              formData.some(
                item =>
                  !item.question ||
                  !item.option_1 ||
                  !item.option_2 ||
                  !item.option_3 ||
                  !item.option_4
              )
            }
            style={{ width: "100%" }}
          >
            {questionLoading ? "Submitting..." : "Submit"}
          </Button>
        )
      )}

      {testQuestions?.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <h3>Existing Questions:</h3>
          <List
            itemLayout="horizontal"
            dataSource={testQuestions}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  title={item.question ? `${index + 1}. ${item.question}` : `Statement ${index + 1}`}
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