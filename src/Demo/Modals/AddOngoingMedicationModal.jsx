import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  PostOngoingMedication,
  GetDiseasesByPatientId,
} from "../Redux/Slices/PatientHistorySlice";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import { GetAllDetailHistoryyy } from "../Redux/Slices/PatientSlice"; //  IMPORT THIS

const { Option } = Select;

const AddOngoingMedicationModal = ({
  visible,
  onClose,
  patientId,
  setOngoingMedication,
  setLoading,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { diseases } = useSelector((state) => state.patienthistory);
  const { users } = useSelector((state) => state.users);
  const doctorOptions = users?.filter((user) => user.designation === "doctor");

  useEffect(() => {
    if (visible && patientId) {
      dispatch(GetAllUsers());
      dispatch(GetDiseasesByPatientId(patientId));
    }
  }, [dispatch, visible, patientId]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        patient: patientId,
      };

      await dispatch(PostOngoingMedication(payload)).unwrap();

      //  Refresh updated history using GetAllDetailHistoryyy
      setLoading(true);
      const res = await dispatch(GetAllDetailHistoryyy(patientId)).unwrap();
      setOngoingMedication(res.ongoing_medications || []);
      setLoading(false);

      form.resetFields();
      onClose();
    } catch (err) {
      message.error("Failed to add medication");
    }
  };

  return (
    <Modal
      title="Add Ongoing Medication"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Add"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="medicine_name" label="Medicine Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
          <Select placeholder="Select type">
            {[
              "tablet",
              "capsule",
              "syrup",
              "injection",
              "ointment",
              "inhaler",
              "drops",
              "patch",
            ].map((val) => (
              <Option key={val} value={val}>
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="dosage_amount" label="Dosage Amount" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="dosage_unit" label="Dosage Unit" rules={[{ required: true }]}>
          <Select placeholder="Select unit">
            {["mg", "ml", "g", "mcg", "units"].map((unit) => (
              <Option key={unit} value={unit}>
                {unit}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="frequency" label="Frequency" rules={[{ required: true }]}>
          <Select placeholder="Select frequency">
            {[
              "once_daily",
              "twice_daily",
              "thrice_daily",
              "once_evening",
              "once_morning",
              "alternate_days",
              "weekly",
              "as_needed",
              "custom",
            ].map((freq) => (
              <Option key={freq} value={freq}>
                {freq.replace(/_/g, " ")}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="doctor" label="Doctor" rules={[{ required: true }]}>
          <Select placeholder="Select doctor">
            {doctorOptions?.map((doctor) => (
              <Option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="diseases_name" label="Disease" rules={[{ required: true }]}>
          <Select placeholder="Select disease">
            {diseases?.map((disease) => (
              <Option key={disease.id} value={disease.id}>
                {disease.disease_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOngoingMedicationModal;
