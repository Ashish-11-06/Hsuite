import React, { useState, useEffect } from "react";
import { Modal, Form, Radio, Select, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { addTreatment } from "../Redux/Slices/personaltreatmentSlice";
import GetPersonalityStepsModal from "./GetPersonalityStepsModal";

const { Option } = Select;

const AddEgoPredefinedTreatModal = ({
  visible,
  onClose,
  userId,
  statementCategories,
  resultCategories // Add this new prop for categories from results
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);

  const [stepsModalVisible, setStepsModalVisible] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
   const [stepsData, setStepsData] = useState(null);

  useEffect(() => {
    if (visible && resultCategories) {
      // Filter statementCategories to only include those present in resultCategories
      const filteredCategories = Object.entries(statementCategories)
        .filter(([id]) => resultCategories.some(cat => cat.id === id))
        .map(([id, name]) => ({
          id,
          name
        }));
      
      setAvailableCategories(filteredCategories);
    }
  }, [visible, statementCategories, resultCategories]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        user_id: userId,
        category_id: values.category,
        type: values.action,
      };

      dispatch(addTreatment(payload))
        .unwrap()
        .then((response) => {
          setSubmittedData({
  categoryName: response.treatment.category_name,
  type: response.treatment.type,
  quizId: response.steps.id,
  treatmentId: response.treatment.id 
});
console.log(response.steps);
          setStepsData(response.steps);
          setStepsModalVisible(true);
   setStepsModalVisible(true);
          form.resetFields();
        })
        .catch((error) => {
          Modal.error({
            title: "Error",
            content: error?.message || "Failed to submit treatment",
          });
        });
    } catch (error) {
      console.error("Form submission error:", error);
      Modal.error({
        title: "Error",
        content: error.message || "Form validation failed",
      });
    }
  };

  return (
    <>
    <Modal
      title="Add Predefined Treatment"
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical"
      onFinish={handleSubmit}>
        <Form.Item
          name="action"
          label="type"
          rules={[{ required: true, message: "Please select an action" }]}
        >
          <Radio.Group>
            <Radio value="increase">Increase</Radio>
            <Radio value="decrease">Decrease</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select 
            placeholder="Select a category"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {availableCategories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit">
            Treatment
            </Button>
          </Form.Item>
      </Form>
    </Modal>

    {submittedData && (
  <GetPersonalityStepsModal
    visible={stepsModalVisible}
    onClose={() => {
      setStepsModalVisible(false);
      onClose();
    }}
    quizId={submittedData.quizId}
    categoryName={submittedData.categoryName}
    type={submittedData.type}
    treatmentId={submittedData.treatmentId}
    stepsData = {stepsData}
  />
)}
    </>
  );
};

export default AddEgoPredefinedTreatModal;