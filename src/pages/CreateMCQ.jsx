import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Button, 
  Space, 
  message, 
  Select, 
  Table, 
  Tag, 
  Popconfirm, 
  Input, 
  Typography, 
  Empty,
  Row,
  Col,
  Spin, 
} from "antd";
import { DeleteOutlined, EditOutlined, FileAddOutlined, PlusSquareOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import AddMCQQuestionModal from "../Modals/AddMCQQuestionModal";
import AddMcqQuizModal from "../Modals/AddMcqQuizModal";
import EditMCQModal from "../Modals/EditMCQModal";
import { useDispatch, useSelector } from "react-redux";
import { 
  addMcqQuiz, 
  getAllQuizzes,
  fetchAllQuestionsByQuiz,
  updateQuestion,
  deleteQuestion
} from "../Redux/Slices/mcqSlice";

const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;

const CreateMCQ = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
  const { quizzes, questions, loading, quizQuestions } = useSelector((state) => state.mcq);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllQuizzes());
  }, [dispatch]);

  useEffect(() => {
    if (selectedQuiz) {
      dispatch(fetchAllQuestionsByQuiz(selectedQuiz));
    }
  }, [selectedQuiz, dispatch]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenQuizModal = () => setIsQuizModalOpen(true);
  const handleCloseQuizModal = () => setIsQuizModalOpen(false);

  const handleQuestionSubmit = (data) => {
    // console.log("Received MCQ data:", data);
    handleCloseModal();
    dispatch(fetchAllQuestionsByQuiz(selectedQuiz));
  };

  const handleQuizSubmit = async (quizData) => {
    try {
      const result = await dispatch(addMcqQuiz(quizData));
      if (addMcqQuiz.fulfilled.match(result)) {
        message.success("Quiz added successfully!");
        handleCloseQuizModal();
        // dispatch(fetchAllQuestionsByQuiz(selectedQuiz));
      }
    } catch (err) {
      message.error("Failed to add quiz.");
    }
  };

  const handleQuizSelect = (value) => {
    setSelectedQuiz(value);
  };

  const handleEdit = (question) => {
    setCurrentQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleUpdateQuestion = async (questionId, questionData) => {
    try {
      await dispatch(updateQuestion({ questionId, questionData })).unwrap();
      dispatch(fetchAllQuestionsByQuiz(selectedQuiz));
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await dispatch(deleteQuestion(questionId)).unwrap();
      message.success('Question deleted successfully');
      dispatch(fetchAllQuestionsByQuiz(selectedQuiz));
    } catch (error) {
      message.error('Failed to delete question');
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredQuestions = quizQuestions?.filter(question => 
    question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(question).some(val => 
      typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns = [
    {
      title: 'Sr. No.',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Options',
      key: 'options',
      render: (record) => (
        <div>
          <div><strong>Option 1:</strong> {record.options_1}</div>
          <div><strong>Option 2:</strong> {record.options_2}</div>
          <div><strong>Option 3:</strong> {record.options_3}</div>
          <div><strong>Option 4:</strong> {record.options_4}</div>
        </div>
      ),
    },
    {
      title: 'Correct Answer(s)',
      key: 'correct_ans',
      render: (record) => (
        <div>
          {record.correct_ans.map((ans, index) => {
            const optionNum = ans.replace('options_', '').replace('option_', '');
            const optionText = record[`options_${optionNum}`];
            return (
              <Tag color="green" key={index}>
                Option {optionNum}: {optionText}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} 
          style={{
                    backgroundColor: "#ff9f00",
                    borderColor: "#ff9f00",
                    color: "black"
                  }}>
                    Edit</Button>
          <Popconfirm
            title="Are you sure to delete this question?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} style={{
                    backgroundColor: "#d90027",
                    borderColor: "#d90027",
                    color: "white"
                  }}>
                    Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
   <div style={{ position: "relative", margin: "20px" }}>
  <Button
    icon={<ArrowLeftOutlined />}
    type="primary"
    onClick={() => navigate(-1)}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      // fontSize: "40px",
      color: "white",
    }}
  >Back</Button>
</div>
    <div style={{ 
      maxWidth: "1200px", 
      margin: "40px",
      marginTop: "70px",
      padding: "0 20px",
      minHeight: "calc(100vh - 40px)"
    }}>
      {/* Search row */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Search
            placeholder="Search questions or options..."
            allowClear
            enterButton="Search"
            size="large"
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {/* Filter and action buttons row */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col xs={24} md={12}>
          {loading ? (
            <Spin />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Select Quiz:</label>
              <Select
                allowClear
                showSearch
                style={{ width: "100%" }}
                placeholder="Select a quiz"
                value={selectedQuiz}
                onChange={handleQuizSelect}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent={<Text type="secondary">No quizzes found</Text>}
              >
                {quizzes?.map((quiz) => (
                  <Option key={quiz.id} value={quiz.id}>
                    {quiz.name}
                  </Option>
                ))}
              </Select>
            </div>
          )}
        </Col>
        <Col xs={24} md={12} style={{ textAlign: "right", marginTop: { xs: "16px", md: "0" } }}>
          <div style={{ display: "inline-flex", gap: "10px" }}>
            <Button
            icon={<PlusSquareOutlined />}
              onClick={handleOpenQuizModal}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                color: "#fff",
                backgroundColor: "#1890ff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                minWidth: "120px"
              }}
            >
              Add Quiz
            </Button>

            <Button
            icon={<FileAddOutlined />}
              onClick={handleOpenModal}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                color: "#fff",
                backgroundColor: "#52c41a",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                minWidth: "120px"
              }}
            >
              Add Question
            </Button>
          </div>
        </Col>
      </Row>

      {/* Modals */}
      <AddMCQQuestionModal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleQuestionSubmit} 
      />
      <AddMcqQuizModal 
        open={isQuizModalOpen} 
        onClose={handleCloseQuizModal} 
        onSubmit={handleQuizSubmit} 
      />
      <EditMCQModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        question={currentQuestion}
        onUpdate={handleUpdateQuestion}
      />

      {/* Content area */}
      {selectedQuiz ? (
        <div style={{ margin: "20px 0" }}>
           {/* ✅ Total questions + note section */}
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      marginBottom: "10px", 
      padding: "10px", 
    }}>
      <Text strong>Total Questions: {filteredQuestions?.length || 0}</Text>
      <Text type="danger">Note: A minimum of 20 questions is mandatory for the quiz.</Text>
    </div>
          <Table
            columns={columns}
            dataSource={filteredQuestions}
            rowKey="id"
            loading={loading}
            bordered
            scroll={{ x: true }}
          />
        </div>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          textAlign: "center",
        }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary" style={{ fontSize: "16px" }}>
                ⚠️ Please select a quiz from the dropdown <br></br>to view questions
              </Text>
            }
          />
        </div>
      )}
    </div>
    </>
  );
};

export default CreateMCQ;