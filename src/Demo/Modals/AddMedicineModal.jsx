import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  Select,
  DatePicker,
  Row,
  Col,
  Button,
  Divider,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { PostMedicine } from "../Redux/Slices/PatientHistorySlice";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import dayjs from "dayjs";

const { Option } = Select;

const AddMedicineModal = ({ open, onClose, clinicalNoteId, onMedicineAdded }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [doctorId, setDoctorId] = useState(null);
  const [medicineForms, setMedicineForms] = useState([{}]);

  const { users } = useSelector((state) => state.users);
  const doctorOptions = users?.filter((user) => user.designation === "doctor");

  useEffect(() => {
    if (!users?.length) dispatch(GetAllUsers());
  }, [users, dispatch]);

  const addNewMedicineBlock = () => {
    setMedicineForms([...medicineForms, {}]);
  };

 const handleSubmit = async () => {
  try {
    const values = await form.validateFields();

    if (!doctorId) {
      return message.warning("Please select a doctor");
    }

    const payload = medicineForms.map((_, idx) => {
      const entry = values[`medicines_${idx}`];
      return {
        medicine_name: entry.medicine_name,
        type: entry.type,
        dosage_amount: Number(entry.dosage_amount),
        dosage_unit: entry.dosage_unit,
        frequency: entry.frequency,
        till_date: entry.till_date.format("YYYY-MM-DD"),
        added_by: doctorId,
        clinical_note: clinicalNoteId,
      };
    });

    // Send the array of medicines in one API call
    await dispatch(PostMedicine(payload)).unwrap();

    await onMedicineAdded();
    form.resetFields();
    setMedicineForms([{}]);
    setDoctorId(null);
    onClose();
  } catch (err) {
    message.error("Failed to add medicines. Please fill all required fields.");
  }
};



  return (
    <Modal
      open={open}
      title="Add Medicine"
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Add"
      width={700}
      styles={{
    body: { maxHeight: "60vh", overflowY: "auto", paddingRight: 12 }
  }}
    >
      <Form form={form} layout="vertical">
        {medicineForms.map((_, idx) => (
          <div key={idx} style={{ marginBottom: 16, borderBottom: "1px solid #eee", paddingBottom: 12 }}>
            <Divider orientation="left">Medicine {idx + 1}</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={["medicines_" + idx, "medicine_name"]}
                  label="Medicine Name"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="e.g., Paracetamol" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name={["medicines_" + idx, "type"]}
                  label="Type"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select type">
                    <Option value="tablet">Tablet</Option>
                    <Option value="liquid">Liquid</Option>
                    <Option value="injection">Injection</Option>
                    <Option value="ointment">Ointment</Option>
                    <Option value="inhaler">Inhaler</Option>
                    <Option value="drops">Drops</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name={["medicines_" + idx, "dosage_amount"]}
                  label="Dosage Amount"
                  rules={[{ required: true }]}
                >
                  <Input type="number" placeholder="e.g., 500" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name={["medicines_" + idx, "dosage_unit"]}
                  label="Dosage Unit"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select unit">
                    <Option value="mg">mg</Option>
                    <Option value="ml">ml</Option>
                    <Option value="g">g</Option>
                    <Option value="units">units</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name={["medicines_" + idx, "frequency"]}
                  label="Frequency"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select frequency">
                    <Option value="once_daily">Once Daily</Option>
                    <Option value="twice_daily">Twice Daily</Option>
                    <Option value="thrice_daily">Thrice Daily</Option>
                    <Option value="morning">Morning</Option>
                    <Option value="evening">Evening</Option>
                    <Option value="night">Night</Option>
                    <Option value="before_meal">Before Meal</Option>
                    <Option value="after_meal">After Meal</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name={["medicines_" + idx, "till_date"]}
                  label="Till Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        ))}

        <Button
          icon={<PlusOutlined />}
          onClick={addNewMedicineBlock}
          style={{ marginBottom: 24 }}
          type="dashed"
          block
        >
          Add New Medicine
        </Button>

        <Form.Item label="Select Doctor" required>
          <Select
            placeholder="Select a doctor"
            value={doctorId}
            onChange={(value) => setDoctorId(value)}
            showSearch
            optionFilterProp="children"
          >
            {doctorOptions?.map((doctor) => (
              <Option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMedicineModal;
