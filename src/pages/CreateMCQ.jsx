import React, { useState, useEffect } from "react";
import { Button, Space, message, Select, Table, Tag, Popconfirm } from "antd";
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

const CreateMCQ = () => {
  const dispatch = useDispatch();
  const { quizzes, questions, loading, quizQuestions } = useSelector((state) => state.mcq);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    dispatch(getAllQuizzes());
  }, [dispatch]);

  useEffect(() => {
    if (selectedQuiz) {
      dispatch(fetchAllQuestionsByQuiz(selectedQuiz)); // Fetch questions for the selected quiz
    }
  }, [selectedQuiz, dispatch]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenQuizModal = () => setIsQuizModalOpen(true);
  const handleCloseQuizModal = () => setIsQuizModalOpen(false);

  const handleQuestionSubmit = (data) => {
    console.log("Received MCQ data:", data);
    handleCloseModal();
    dispatch(fetchAllQuestionsByQuiz(selectedQuiz));
  };

  const handleQuizSubmit = async (quizData) => {
    try {
      const result = await dispatch(addMcqQuiz(quizData));
      if (addMcqQuiz.fulfilled.match(result)) {
        message.success("Quiz added successfully!");
        handleCloseQuizModal();
        dispatch(fetchAllQuestionsByQuiz(selectedQuiz));
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
      dispatch(fetchAllQuestionsByQuiz(selectedQuiz)); // Refresh questions after update
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await dispatch(deleteQuestion(questionId)).unwrap();
      message.success('Question deleted successfully');
      dispatch(fetchAllQuestionsByQuiz(selectedQuiz)); // Refresh questions after delete
    } catch (error) {
      message.error('Failed to delete question');
    }
  };

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
            // Extract the option number (1, 2, 3, or 4) from the answer key
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
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this question?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Button type="primary" onClick={handleOpenModal}>
            Add Question
          </Button>
          <Button type="default" onClick={handleOpenQuizModal}>
            Add Quiz
          </Button>
        </Space>

        <Select
          style={{ width: '100%', maxWidth: '400px' }}
          placeholder="Select a quiz"
          loading={loading}
          onChange={handleQuizSelect}
          value={selectedQuiz}
          optionFilterProp="children"
          showSearch
        >
          {quizzes.map((quiz) => (
            <Option key={quiz.id} value={quiz.id}>
              {quiz.name}
            </Option>
          ))}
        </Select>

        {selectedQuiz && (
          <Table
            columns={columns}
            dataSource={quizQuestions} // Now using quizQuestions from Redux
            rowKey="id"
            loading={loading}
            bordered
            style={{ marginTop: '20px' }}
          />
        )}
      </Space>

      <AddMCQQuestionModal open={isModalOpen} onClose={handleCloseModal} onSubmit={handleQuestionSubmit} />
      <AddMcqQuizModal open={isQuizModalOpen} onClose={handleCloseQuizModal} onSubmit={handleQuizSubmit} />
      <EditMCQModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        question={currentQuestion}
        onUpdate={handleUpdateQuestion}
      />
    </div>
  );
};

export default CreateMCQ;