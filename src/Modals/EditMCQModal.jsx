import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Checkbox, Row, Col } from 'antd';

const EditMCQModal = ({ open, onClose, question, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  useEffect(() => {
    if (question) {
      form.setFieldsValue({
        question: question.question,
        options_1: question.options_1,
        options_2: question.options_2,
        options_3: question.options_3,
        options_4: question.options_4,
      });
      // Initialize correct answers state
      setCorrectAnswers(question.correct_ans || []);
    }
  }, [question, form]);

  const handleCorrectAnswerChange = (checkedValues) => {
    setCorrectAnswers(checkedValues);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Prepare the payload with correct answers
      const payload = {
        ...values,
        correct_ans: correctAnswers
      };

      await onUpdate(question.id, payload);
      message.success('Question updated successfully');
      onClose();
    } catch (error) {
      message.error(error.message || 'Failed to update question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Question"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading} 
          onClick={handleSubmit}
          disabled={correctAnswers.length === 0}
        >
          Update
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="question" label="Question" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        
        <Form.Item name="options_1" label="Option 1" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="options_2" label="Option 2" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="options_3" label="Option 3" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="options_4" label="Option 4" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Correct Answer(s)" required>
          <Checkbox.Group 
            style={{ width: '100%' }} 
            value={correctAnswers}
            onChange={handleCorrectAnswerChange}
          >
            <Row>
              <Col span={24}>
                <Checkbox value="options_1">Option 1</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="options_2">Option 2</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="options_3">Option 3</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="options_4">Option 4</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMCQModal;