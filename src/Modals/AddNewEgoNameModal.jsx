import React from "react";
import { Modal, Form, Input } from "antd";
import { addEgogramTest } from "../Redux/Slices/egoSlice";
import { useDispatch } from "react-redux";

const AddNewEgoNameModal = ({ open, onClose, onNewNameAdded }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(values => {
        dispatch(addEgogramTest(values)).then(action => {
          if (action.payload?.data?.test_name) {
            form.resetFields();
            onNewNameAdded(action.payload.data.id); // Pass the ID of the new test
            onClose();
          } else {
            console.error("Invalid payload:", action.payload);
          }
        });
      })
      .catch(info => {
        // console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title="Create New Egogram"
      visible={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Submit"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Egogram Name"
          name="test_name"
          rules={[{ required: true, message: "Please enter egogram name" }]}
        >
          <Input placeholder="Enter Egogram name"/>
        </Form.Item>
        <Form.Item
          label="Description"
          name="test_description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter Egogram Description"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewEgoNameModal;
