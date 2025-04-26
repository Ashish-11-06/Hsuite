import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, message, Radio } from "antd";
import { postQuizName, resetQuizState, getQuizCategories } from "../Redux/Slices/quizSlice";

const CreateQuizModal = ({ visible, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error, success, data, message: apiMessage } = useSelector((state) => state.quiz || {});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("question"); // 'question' or 'statement'
  const [formData, setFormData] = useState({
    category_1: "",
    category_2: "",
    category_3: "",
    category_4: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!quizName.trim()) {
      message.error("Please enter a quiz name");
      return;
    }

    const emptyCategories = Object.values(formData).filter(val => !val.trim()).length;
    if (emptyCategories > 0) {
      message.error("Please fill all 4 categories");
      return;
    }

    setFormSubmitted(false);
    const payload = {
      quiz_name: quizName,
      quiz_type: quizType,
      ...formData,
    };
    dispatch(postQuizName(payload));
  };

  useEffect(() => {
    if (success && !formSubmitted) {
      setQuizName("");
      setQuizType("question");
      setFormData({
        category_1: "",
        category_2: "",
        category_3: "",
        category_4: "",
      });
      setFormSubmitted(true);

      message.success(apiMessage);
      dispatch(getQuizCategories());
      onCancel();
      onSuccess?.();
      dispatch(resetQuizState());
    }
  }, [success, dispatch, onSuccess, onCancel, apiMessage, formSubmitted]);

  return (
    <Modal
      open={visible}
      title="Add Quiz"
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Create Quiz"
      width={600}
      destroyOnClose
    >
       <div
    style={{
      maxHeight: "400px",
      overflowY: "auto",
      paddingRight: "8px"
    }}
  >
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>Select Type:</label>
        <Radio.Group 
          onChange={(e) => setQuizType(e.target.value)} 
          value={quizType}
          style={{ marginBottom: "16px" }}
        >
          <Radio value="question">Question-Based</Radio>
          <Radio value="statement">Statement-Based</Radio>
        </Radio.Group>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>Quiz Name:</label>
        <input
          type="text"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          placeholder="Enter quiz name"
          style={{
            width: "100%",
            padding: "6px 12px",
            borderRadius: "4px",
            border: "1px solid #d9d9d9",
            fontSize: "14px",
          }}
        />
      </div>

      {[...Array(4)].map((_, index) => {
        const cat = `category_${index + 1}`;
        return (
          <div key={cat} style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              Category {index + 1}:
            </label>
            <input
              type="text"
              name={cat}
              value={formData[cat]}
              onChange={handleChange}
              placeholder={`Enter Category ${index + 1}`}
              style={{
                width: "100%",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #d9d9d9",
                fontSize: "14px",
              }}
            />
          </div>
        );
      })}
      </div>
    </Modal>
  );
};

export default CreateQuizModal;
