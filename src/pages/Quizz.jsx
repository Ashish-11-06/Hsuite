import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message as antdMessage } from "antd";
import { postQuizName, resetQuizState, getQuizCategories } from "../Redux/Slices/quizSlice";

const Quizz = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error, success, data, message } = useSelector((state) => state.quiz || {});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [quizName, setQuizName] = useState("");
  const [visibleCategories, setVisibleCategories] = useState(2);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(false);
    const payload = {
      quiz_name: quizName,
      ...formData,
    };
    dispatch(postQuizName(payload));
  };

  const handleAddCategory = () => {
    if (visibleCategories < 4) {
      setVisibleCategories((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (success) {
      setQuizName("");
      setFormData({
        category_1: "",
        category_2: "",
        category_3: "",
        category_4: "",
      });
      setVisibleCategories(2);
      setFormSubmitted(true);

      antdMessage.success(message);
      dispatch(getQuizCategories());

      const timer = setTimeout(() => {
        onSuccess?.();
        dispatch(resetQuizState());
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch, onSuccess, message]);

  return (
    <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: "10px" }}>
            <label>Quiz Name:</label>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              placeholder="Enter quiz name"
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
          </div>

          {[...Array(visibleCategories)].map((_, index) => {
            const cat = `category_${index + 1}`;
            return (
              <div key={cat} style={{ marginBottom: "10px" }}>
                <label>Category {index + 1}:</label>
                <input
                  type="text"
                  name={cat}
                  value={formData[cat]}
                  onChange={handleChange}
                  placeholder={`Enter Category ${index + 1}`}
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            );
          })}

          {visibleCategories < 4 && (
            <button
              type="button"
              onClick={handleAddCategory}
              style={{
                marginBottom: "15px",
                padding: "6px 12px",
                backgroundColor: "#52c41a",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              + Add Category
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1890ff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {loading ? "Creating..." : "Create Quiz"}
          </button>
    </form>
  );
};

export default Quizz;