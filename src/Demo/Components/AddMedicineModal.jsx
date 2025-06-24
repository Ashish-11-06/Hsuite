import React, { useEffect, useState } from "react";
import { Modal, Form, Input, message, Select, DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PostMedicine } from "../Redux/Slices/PatientHistorySlice";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";

const { Option } = Select;

const AddMedicineModal = ({ open, onClose, clinicalNoteId, onMedicineAdded }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [doctorId, setDoctorId] = useState(null);

  const { users } = useSelector((state) => state.users);
  const doctorOptions = users?.filter((user) => user.designation === "doctor");

  useEffect(() => {
    if (!users?.length) {
      dispatch(GetAllUsers());
    }
  }, [users, dispatch]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!doctorId) {
        return message.warning("Please select a doctor");
      }

      const payload = {
        medicine_name: values.medicine_name,
        type: values.type,
        dosage_amount: Number(values.dosage_amount),
        dosage_unit: values.dosage_unit,
        frequency: values.frequency,
        till_date: values.till_date.format("YYYY-MM-DD"),
        added_by: doctorId,
        clinical_note: clinicalNoteId,
      };

      await dispatch(PostMedicine(payload)).unwrap();
      await onMedicineAdded();
      form.resetFields();
      setDoctorId(null);
      onClose();
    } catch (error) {
      message.error("Failed to add medicine. Check required fields.");
    }
  };

  return (
    <Modal
      open={open}
      title="Add Medicine"
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Add"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="medicine_name" label="Medicine Name" rules={[{ required: true }]}>
          <Input placeholder="e.g., Paracetamol" />
        </Form.Item>

        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
          <Select placeholder="Select type">
            <Option value="tablet">Tablet</Option>
            <Option value="liquid">Liquid</Option>
            <Option value="injection">Injection</Option>
            <Option value="ointment">Ointment</Option>
            <Option value="inhaler">Inhaler</Option>
            <Option value="drops">Drops</Option>
          </Select>
        </Form.Item>

        <Form.Item name="dosage_amount" label="Dosage Amount" rules={[{ required: true }]}>
          <Input type="number" placeholder="e.g., 500" />
        </Form.Item>

        <Form.Item name="dosage_unit" label="Dosage Unit" rules={[{ required: true }]}>
          <Select placeholder="Select unit">
            <Option value="mg">mg</Option>
            <Option value="ml">ml</Option>
            <Option value="g">g</Option>
            <Option value="units">units</Option>
          </Select>
        </Form.Item>

        <Form.Item name="frequency" label="Frequency" rules={[{ required: true }]}>
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

        <Form.Item name="till_date" label="Till Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

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
