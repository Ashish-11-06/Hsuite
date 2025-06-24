import React from "react";
import { Modal, Form, Select, Input, DatePicker, Row, Col, Button } from "antd";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportsFilterModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log("Filter values:", values);
      onClose();
    });
  };

  return (
    <Modal
      title="Advanced Report Filters"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="department" label="Department">
              <Select placeholder="Select department">
                <Option value="General">General</Option>
                <Option value="Cardiology">Cardiology</Option>
                <Option value="Dermatology">Dermatology</Option>
                <Option value="ENT">ENT</Option>
                <Option value="Orthopedics">Orthopedics</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="doctor" label="Doctor">
              <Input placeholder="Doctor Name" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="range" label="Date Range">
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ReportsFilterModal;
