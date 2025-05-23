import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  Input,
  Button,
  message,
  Radio,
  Card,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createPersonalitySteps } from "../Redux/Slices/personaltreatmentSlice";
import { fetchAllEgogramCategories } from "../Redux/Slices/egoSlice";

const { Option } = Select;

const EgogramStepsModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [steps, setSteps] = useState([{ key: 1 }]);
  const [type, setType] = useState("increase");
  const dispatch = useDispatch();

  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.ego
  );

  useEffect(() => {
    if (visible) {
      dispatch(fetchAllEgogramCategories());
    } else {
      form.resetFields();
      setSteps([{ key: 1 }]);
      setType("increase");
    }
  }, [visible, form, dispatch]);

  const handleAddStep = () => {
    if (steps.length < 10) {
      setSteps([...steps, { key: steps.length + 1 }]);
    } else {
      message.warning("Maximum 10 steps allowed");
    }
  };

  const handleSubmit = (values) => {
    const selectedCategory = categories.find(
      (cat) => cat.id === values.category_id
    );
    const categoryName = selectedCategory?.category || "this category";

    if (steps.length < 10) {
      message.warning(`Please add 10 steps for the selected category: ${categoryName}`);
      return;
    }

    const stepsData = {
      type,
      category: values.category_id,
      ...Object.fromEntries(
        steps.map((step, index) => [
          `step_${index + 1}`,
          {
            title: values[`stepTitle_${step.key}`],
            description: values[`stepDesc_${step.key}`],
          },
        ])
      ),
    };

    dispatch(createPersonalitySteps(stepsData))
      .unwrap()
      .then((res) => {
        message.success("Steps created successfully");
        onSuccess();
        form.resetFields();
        setSteps([{ key: 1 }]);
        setType("increase");
      })
     .catch((errorMessage) => {
       message.error(errorMessage);
     });
  };

  return (
    <Modal
      title="Add Egogram Steps"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="category_id"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            placeholder="Select category"
            loading={categoriesLoading}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {Array.isArray(categories) &&
              categories.filter(Boolean).map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.category}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item label="Step Type">
          <Radio.Group
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <Radio value="increase">Increase</Radio>
            <Radio value="decrease">Decrease</Radio>
          </Radio.Group>
        </Form.Item>

        {steps.map((step) => (
          <Card
            key={step.key}
            title={`Step ${step.key}`}
            style={{ marginBottom: 16 }}
          >
            <Form.Item
              name={`stepTitle_${step.key}`}
              label="Title"
              rules={[{ required: true, message: "Please enter step title" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={`stepDesc_${step.key}`}
              label="Description"
              rules={[{ required: true, message: "Please enter step description" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Card>
        ))}

        <Form.Item>
          <Button
            type="dashed"
            onClick={handleAddStep}
            block
            disabled={steps.length >= 10}
          >
            + Add Step
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={categoriesLoading}>
            Save Steps
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EgogramStepsModal;
