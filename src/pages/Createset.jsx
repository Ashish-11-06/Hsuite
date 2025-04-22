import React, { useState, useEffect } from "react";
import { Modal, Select, Spin, Row, Col, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Quizz from "./Quizz";
import Test from "./Test";
import AllTestQuestions from "./AllTestQuestions";
import { getQuizCategories } from "../Redux/Slices/quizSlice";

const { Option } = Select;
const { Search } = Input;

const Createset = () => {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { quizList, loading: quizLoading } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(getQuizCategories());
  }, [dispatch]);

  const showQuizModal = () => setIsQuizModalOpen(true);
  const showTestModal = () => setIsTestModalOpen(true);

  const handleCancel = () => {
    setIsQuizModalOpen(false);
    setIsTestModalOpen(false);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <>
      {/* Main container */}
      <div style={{ 
        maxWidth: "1200px", 
        margin: "20px auto",
        padding: "0 20px"
      }}>
        {/* Search row above the filter/buttons row */}
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col span={24}>
            <Search
              placeholder="Search questions or options..."
              allowClear
              enterButton
              size="large"
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={handleSearch}
              style={{ width: "100%" }}
            />
          </Col>
        </Row>

        {/* Filter and action buttons row */}
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col span={12}>
            {/* Dropdown in place of search bar */}
            {quizLoading ? (
              <Spin />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontWeight: "bold" }}>Select Quiz:</label>
                <Select
                  allowClear
                  showSearch
                  style={{ width: "60%" }}
                  placeholder="Select a quiz"
                  value={selectedQuizId}
                  onChange={(value) => {
                    console.log("Selected Quiz ID:", value);
                    setSelectedQuizId(value);
                  }}
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
              </div>

            )}
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <div style={{ display: "inline-flex", gap: "10px" }}>
              <button
                onClick={showQuizModal}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  color: "#fff",
                  backgroundColor: "#1890ff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Create Quiz
              </button>

              <button
                onClick={showTestModal}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  color: "#fff",
                  backgroundColor: "#52c41a",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Create Test
              </button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Modals */}
      <Modal
        title="Create Quiz"
        open={isQuizModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Quizz onSuccess={handleCancel} />
      </Modal>

      <Modal
        title="Create Test"
        open={isTestModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Test onSuccess={handleCancel} selectedQuizId={selectedQuizId} />
      </Modal>

      {/* Display All Test Questions after modals */}
      {selectedQuizId && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <AllTestQuestions quizId={selectedQuizId} searchTerm={searchTerm} />
        </div>
      )}
    </>
  );
};

export default Createset;