import React, { useEffect, useState } from "react";
import { Modal, Select, Form, Radio, Button, Spin, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEgogramCategories } from "../Redux/Slices/egoSlice";
import { addTreatment } from "../Redux/Slices/personaltreatmentSlice";
import GetPersonalityStepsModal from "./GetPersonalityStepsModal";

const { Option } = Select;

const AddPredefinedTreatModal = ({ visible, onClose, userId, quizResult}) => {
  const [form] = Form.useForm();
  const [stepsModalVisible, setStepsModalVisible] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [stepsData, setStepsData] = useState(null);

  const dispatch = useDispatch();

  const categoryScores = quizResult?.category_scores || {};
  

  // const quizResult = useSelector((state) => state.quiz.quizResult); // <-- Added this
 const { categories, loading: categoriesLoading, error } = useSelector(
  (state) => state.ego
);

const categoryNamesInResult = quizResult?.category_scores
  ? Object.keys(quizResult.category_scores).map((name) => name.trim().toLowerCase())
  : [];

const filteredCategories = categories?.filter(
  (cat, index, self) =>
    categoryNamesInResult.includes(cat.category.trim().toLowerCase()) &&
    index === self.findIndex(
      (c) => c.category.trim().toLowerCase() === cat.category.trim().toLowerCase()
    )
);

useEffect(() => {
  if (visible) {
  console.log(`Modal opened, fetching categories...${filteredCategories}`);
  console.log(`categories:`, categories);
  }
}, [visible]);

  useEffect(() => {
  if (visible) {
    dispatch(fetchAllEgogramCategories());
    form.resetFields();
  }
}, [visible, dispatch, form]);

useEffect(() => {
  // console.log("Fetched categories:", categories);
}, [categories]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!userId) {
        throw new Error("User ID is required but not available");
      }

      const payload = {
        user_id: userId,
        category_id: values.category_id,
        type: values.type
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
          // console.log(response.steps);
          setStepsData(response.steps);
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
      title="Select Categorykk"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      {categoriesLoading ? (
        <div style={{ textAlign: "center", padding: "24px" }}>
          <Spin size="large" />
          <p>Loading categories...</p>
        </div>
      ) : error ? (
        <Alert
          message="Error loading categories"
          description={error.message || "Something went wrong"}
          type="error"
          showIcon
        />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ type: "increase" }}
        >
          <Form.Item
            label="Step Type"
            name="type"
            rules={[{ required: true, message: "Please select a step type" }]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="increase">Increase</Radio.Button>
              <Radio.Button value="decrease">Decrease</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="category_id"
            label="Select a Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              placeholder="Select a category"
              showSearch
              optionFilterProp="children"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {filteredCategories?.map((category) => (
  <Option key={category.id} value={category.id}>
    {category.category} 
    {/* ({categoryScores[category.category] || 0}) */}
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
      )}
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

export default AddPredefinedTreatModal;
