import React, { useEffect, useState } from "react";
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
} from "antd";

const { Text } = Typography;

const AllTestQuestions = ({ quizId, searchTerm }) => {
  const dispatch = useDispatch();
  const { loading, testQuestions = [], error } = useSelector((state) => state.quiz);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form] = Form.useForm();

  const filteredQuestions = testQuestions.filter(question => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      question.question?.toLowerCase().includes(searchLower) ||
      question.option_1?.toLowerCase().includes(searchLower) ||
      question.option_2?.toLowerCase().includes(searchLower) ||
      question.option_3?.toLowerCase().includes(searchLower) ||
      question.option_4?.toLowerCase().includes(searchLower)
    );
  });

  const hasQuestions = filteredQuestions.some(q => q.question && q.question.trim() !== "");

  useEffect(() => {
    if (quizId) {
      dispatch(getAllNewQuestions(quizId));
    }
  }, [dispatch, quizId]);

  const showEditModal = (question) => {
    setEditingQuestion(question);
    form.setFieldsValue({
      question: question.question,
      option_1: question.option_1,
      option_2: question.option_2,
      option_3: question.option_3,
      option_4: question.option_4
    });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updateData = {
        question: values.question,
        option_1: values.option_1,
        option_2: values.option_2,
        option_3: values.option_3,
        option_4: values.option_4,
        quiz_id: quizId,
      };

      await dispatch(updateTestQuestion({
        quizId,
        questionId: editingQuestion.id,
        updatedData: updateData
      }));

      message.success("Question updated successfully!");
      setIsEditModalVisible(false);
      dispatch(getAllNewQuestions(quizId)); // Fixed wrong dispatch
    } catch (error) {
      // message.error("Update failed. Please try again.");
    }
  };

  const handleDelete = (questionId) => {
    dispatch(deleteTestQuestion({ quizId, questionId }))
      .unwrap()
      .then(() => {
        message.success("Question deleted successfully");
        dispatch(getAllNewQuestions(quizId)); // Fixed wrong dispatch
      })
      .catch(() => {
        // message.error("Failed to delete question");
      });
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
                  onClick={() => showEditModal(record)}
                  style={{
                    backgroundColor: "#ff9f00",
                    borderColor: "#ff9f00",
                    color: "black"
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(record.id)}
                  style={{
                    backgroundColor: "#d90027",
                    borderColor: "#d90027",
                    color: "white"
                  }}
                >
                  Delete
                </Button>
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
          <Form.Item name="question" label="Question" required>
            <Input />
          </Form.Item>
          <Form.Item name="option_1" label="Option 1" required>
            <Input />
          </Form.Item>
          <Form.Item name="option_2" label="Option 2" required>
            <Input />
          </Form.Item>
          <Form.Item name="option_3" label="Option 3" required>
            <Input />
          </Form.Item>
          <Form.Item name="option_4" label="Option 4" required>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllTestQuestions;
