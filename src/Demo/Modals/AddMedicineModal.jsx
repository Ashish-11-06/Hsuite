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
import { getPharmacyMedicine } from "../Redux/Slices/StockSlice";
import dayjs from "dayjs";

const { Option } = Select;

const AddMedicineModal = ({ open, onClose, clinicalNoteId, onMedicineAdded }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [doctorId, setDoctorId] = useState(null);

  const { pharmacyMedicines } = useSelector((state) => state.stock);
  const { users } = useSelector((state) => state.users);
  const [submitting, setSubmitting] = useState(false);
  const doctorOptions = users?.filter((user) => user.designation === "doctor");

  useEffect(() => {
    if (!users?.length) dispatch(GetAllUsers());
    dispatch(getPharmacyMedicine());
  }, [dispatch]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!doctorId) {
        return message.warning("Please select a doctor");
      }

      const payload = values.medicines.map((entry) => ({
        pharmacy_medicine: entry.pharmacy_medicine,
        // type: entry.type,
        dosage_amount: Number(entry.dosage_amount),
        dosage_unit: entry.dosage_unit,
        frequency: entry.frequency,
        till_date: entry.till_date.format("YYYY-MM-DD"),
        added_by: doctorId,
        clinical_note: clinicalNoteId,
      }));

      setSubmitting(true);
      await dispatch(PostMedicine(payload)).unwrap();
      await onMedicineAdded();
      form.resetFields();
      setDoctorId(null);
      onClose();
    } catch (err) {
      message.error("Failed to add medicines. Please fill all required fields.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Add Medicine"
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={submitting}
      okText="Add"
      width={700}
      styles={{
        body: { maxHeight: "60vh", overflowY: "auto", paddingRight: 12 }
      }}
    >
      <Form form={form} layout="vertical">
        <Form.List name="medicines" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, idx) => (
                <div key={key} style={{ marginBottom: 16, borderBottom: "1px solid #eee", paddingBottom: 12 }}>
                  <Divider orientation="left">Medicine {idx + 1}</Divider>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "pharmacy_medicine"]}
                        label="Medicine Name"
                        rules={[{ required: true }]}>
                        <Select
                          showSearch
                          placeholder="Select medicine"
                          optionFilterProp="children"
                          onChange={(id) => {
                            const selected = pharmacyMedicines.find((m) => m.id === id);
                            if (selected) {
                              const currentValues = form.getFieldValue("medicines");
                              currentValues[name] = {
                                ...currentValues[name],
                                pharmacy_medicine: selected.id,
                                type: selected.medicine_type || "",
                              };
                              form.setFieldsValue({ medicines: currentValues });
                            }
                          }}
                        >
                          {pharmacyMedicines?.map((med) => (
                            <Option key={med.id} value={med.id}>
                              {med.medicine_name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "type"]}
                        label="Type"
                        rules={[{ required: true }]}
                      >
                        <Input disabled placeholder="Auto-filled" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "dosage_amount"]}
                        label="Dosage Amount"
                        rules={[{ required: true }]}
                      >
                        <Input type="number" placeholder="e.g., 500" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "dosage_unit"]}
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
                        {...restField}
                        name={[name, "frequency"]}
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
                        {...restField}
                        name={[name, "till_date"]}
                        label="Till Date"
                        rules={[{ required: true }]}
                      >
                        <DatePicker style={{ width: "100%" }}
                        disabledDate={(current) => current && current < dayjs().startOf("day")} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ))}
              <Button
                icon={<PlusOutlined />}
                onClick={() => add({})}
                style={{ marginBottom: 24 }}
                type="dashed"
                block
                loading = {submitting}
              >
                Add New Medicine
              </Button>
            </>
          )}
        </Form.List>

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
