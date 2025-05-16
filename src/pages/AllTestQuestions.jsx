import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllNewQuestions,
  deleteTestQuestion,
  updateTestQuestion,
} from "../Redux/Slices/quizSlice";
import {
  Spin,
  Table,
  Button,
  Typography,
  Empty,
  Modal,
  Form,
  Input,
  message,
  Popconfirm
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Text } = Typography;

const AllTestQuestions = ({ quizId, searchTerm }) => {
  const dispatch = useDispatch();
  const { 
    loading, 
    testQuestions = [], 
    error,
    quizList,
  } = useSelector((state) => state.quiz);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form] = Form.useForm();
  const [categoryNames, setCategoryNames] = useState([]);

  // Memoize filtered questions to prevent unnecessary recalculations
  const filteredQuestions = React.useMemo(() => {
    if (!searchTerm) return testQuestions;
    
    const searchLower = searchTerm.toLowerCase();
    return testQuestions.filter(question => (
      (question.question?.toLowerCase().includes(searchLower)) ||
      (question.option_1?.toLowerCase().includes(searchLower)) ||
      (question.option_2?.toLowerCase().includes(searchLower)) ||
      (question.option_3?.toLowerCase().includes(searchLower)) ||
      (question.option_4?.toLowerCase().includes(searchLower))
    ));
  }, [testQuestions, searchTerm]);
  
  const hasQuestions = filteredQuestions.some(q => q.question && q.question.trim() !== "");
  // Fetch questions and set categories
  const fetchData = useCallback(() => {
    if (quizId) {
      dispatch(getAllNewQuestions(quizId));
      
      // Find the selected quiz and set categories
      const selectedQuiz = quizList?.find(quiz => quiz.id === quizId);
      if (selectedQuiz) {
        setCategoryNames([
          selectedQuiz.category_1,
          selectedQuiz.category_2,
          selectedQuiz.category_3,
          selectedQuiz.category_4
        ].filter(Boolean));
      }
    }
  }, [quizId, quizList, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showEditModal = (question) => {
    setEditingQuestion(question);
    const initialValues = {
      option_1: question.option_1,
      option_2: question.option_2,
      option_3: question.option_3,
      option_4: question.option_4
    };
    
    if (hasQuestions) {
      initialValues.question = question.question;
    }
    
    form.setFieldsValue(initialValues);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updateData = {
        option_1: values.option_1,
        option_2: values.option_2,
        option_3: values.option_3,
        option_4: values.option_4,
        quiz_id: quizId,
      };
      
      if (hasQuestions) {
        updateData.question = values.question;
      }

      await dispatch(updateTestQuestion({
        quizId,
        questionId: editingQuestion.id,
        updatedData: updateData
      }));

      message.success("Question updated successfully!");
      setIsEditModalVisible(false);
      fetchData(); // Use the memoized fetch function
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await dispatch(deleteTestQuestion({ quizId, questionId })).unwrap();
      message.success("Question deleted successfully");
      fetchData(); // Use the memoized fetch function
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (!quizId) {
    return <Empty description="Please select a quiz to view questions" />;
  }

  if (loading) return <Spin tip="Loading questions..." />;

  if (error) return <Text type="danger">{error}</Text>;

  if (!Array.isArray(testQuestions)) {
    return <Text type="danger">Invalid data received for test questions.</Text>;
  }


  return (
    <div style={{ width: "100%", padding: "20px" }}>
      {/* Top Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <Text strong style={{ fontSize: 16 }}>
            Total Questions: {filteredQuestions.length}
          </Text>
        </div>
        <div>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Note: A minimum of 20 questions is mandatory for the quiz.
          </Text>
        </div>
      </div>

      {/* Questions Table */}
      {filteredQuestions.length === 0 ? (
        <Empty description={searchTerm ? "No matching questions found" : "No questions found for this quiz."} />
      ) : (
        <Table
          dataSource={filteredQuestions}
          rowKey="id"
          pagination={false}
          style={{ width: "100%" }}
          scroll={{ x: true }}
        >
          <Table.Column
            title="Sr. No."
            render={(text, record, index) => index + 1}
            width="80px"
          />

          {/* Conditionally render Question column */}
          {hasQuestions && (
            <Table.Column
              title="Question"
              dataIndex="question"
              key="question"
              width="30%"
            />
          )}

          <Table.Column
            title="Options"
            render={(text, record) => {
              const options = [
                record.option_1,
                record.option_2,
                record.option_3,
                record.option_4,
              ].filter(Boolean);

              return options.length === 0 ? null : (
                <div>
                  {options.map((opt, idx) => (
                    <p key={idx}>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </p>
                  ))}
                </div>
              );
            }}
            width="40%"
          />

          <Table.Column
            title="Actions"
            render={(text, record) => (
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                icon={<EditOutlined />}
                  onClick={() => showEditModal(record)}
                  style={{
                    backgroundColor: "#ff9f00",
                    borderColor: "#ff9f00",
                    color: "black"
                  }}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this book?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                >   
                  <Button
                  icon ={<DeleteOutlined />}
                    style={{
                      backgroundColor: "#d90027",
                      borderColor: "#d90027",
                      color: "white"
                    }}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            )}
            width="150px"
          />
        </Table>
      )}

      {/* Edit Modal */}
      <Modal
        title="Edit Question"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSubmit}
        okText="Update"
      >
        <Form form={form} layout="vertical">
          {hasQuestions && (
            <Form.Item name="question" label="Question">
              <Input />
            </Form.Item>
          )}
          <Form.Item name="option_1" label={categoryNames[0] || "Option 1"} required>
      <Input placeholder={categoryNames[0] ? `${categoryNames[0]}` : "Enter Option 1"} />
    </Form.Item>
    <Form.Item name="option_2" label={categoryNames[1] || "Option 2"} required>
      <Input placeholder={categoryNames[1] ? `${categoryNames[1]}` : "Enter Option 2"} />
    </Form.Item>
    <Form.Item name="option_3" label={categoryNames[2] || "Option 3"} required>
      <Input placeholder={categoryNames[2] ? `${categoryNames[2]}` : "Enter Option 3"} />
    </Form.Item>
    <Form.Item name="option_4" label={categoryNames[3] || "Option 4"} required>
      <Input placeholder={categoryNames[3] ? `${categoryNames[3]}` : "Enter Option 4"} />
    </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllTestQuestions;