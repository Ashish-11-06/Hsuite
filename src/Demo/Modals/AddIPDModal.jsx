import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, Row, Col, Divider, message, } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";
import { postIPD } from "../Redux/Slices/IpdSlice";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import AssignBedModal from "./AssignBedModal";

const { Option } = Select;

const DEPARTMENT_CHOICES = [
  { value: "operation_theatre", label: "Operation Theatre" },
  { value: "general_surgery", label: "General Surgery" },
  { value: "casualty_department", label: "Casualty Department" },
  { value: "ent_department", label: "ENT Department" },
  { value: "genecology_department", label: "Genecology Department" },
  { value: "neurology_department", label: "Neurology Department" },
  { value: "psychiatry_department", label: "Psychiatry Department" },
  { value: "paediatrics_department", label: "Paediatrics Department" },
];

const BILL_CATEGORY_OPTIONS = ["cash", "online", "insurance", "credit"];

const AddIPDModal = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [showMLC, setShowMLC] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [bedModalOpen, setBedModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const doctors = users?.filter((user) => user.designation === "doctor") || [];
  const [submitting, setSubmitting] = useState(false);
  const [assignedBed, setAssignedBed] = useState(null);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const patientRes = await dispatch(fetchAllPatients()).unwrap();
          const userRes = await dispatch(GetAllUsers()).unwrap();
          setPatients(Array.isArray(patientRes.patients) ? patientRes.patients : []);
          setUsers(Array.isArray(userRes) ? userRes : []);
        } catch (err) {
          message.error("Failed to load patients or users.");
          console.error("Fetch error:", err);
        }
      };

      fetchData();
    }
  }, [open, dispatch]);

  const handleEmergencyClick = () => setSelectedStatus("emergency");
  const handleMLCClick = () => {
    setShowMLC(true);
    setSelectedStatus("mlc");
  };
  const handleNormalClick = () => {
    setShowMLC(false);
    setSelectedStatus("normal");
  };

  const handleSubmit = async (values) => {
    const patientType = selectedStatus || "normal";

    const payload = {
      patient: values.existingPatient,
      bill_category: values.billCategory,
      department: values.department,
      description: values.reason,
      admitted_doctor: values.doctor,
      admit_date: values.admitDate
        ? values.admitDate.format("YYYY-MM-DD")
        : null,
      patient_type: patientType,
      guardian_relation: values.kinRelation,
      guardian_name: values.kinName,
      guardian_mobile: values.kinMobile,
    };

    if (patientType === "mlc") {
      payload.police_station_name = values.policeStation;
      payload.informed_on = values.informedOn
        ? values.informedOn.format("YYYY-MM-DD")
        : null;
      payload.injury_details = values.mlcNote;
      payload.incident_datetime = values.incidentDateTime
        ? values.incidentDateTime.toISOString()
        : null;
      payload.mlc_number = values.mlcNo;
      payload.mlc_type = values.mlcType;
    }

    setSubmitting(true);
    try {
      await dispatch(postIPD(payload));
      if (onSubmit) onSubmit(payload);
      onClose();
      form.resetFields();
      setSelectedStatus(null);
      setAssignedBed(null);
      setShowMLC(false);
    } catch (error) {
      message.error("IPD submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Add IPD Admission"
      open={open}
      onCancel={onClose}
      confirmLoading={submitting}
      width={1000}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="existingPatient"
              label="Select Existing Patient"
              rules={[{ required: true, message: "Please select a patient" }]}
            >
              <Select placeholder="Select Patient">
                {patients.map((patient) => (
                  <Option key={patient.id} value={patient.id}>
                    {patient.patient_id} - {patient.full_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Status Dots */}
            <Row
              gutter={16}
              style={{ marginTop: "-8px", marginBottom: "16px" }}
            >
              {["normal", "mlc", "emergency"].map((status) => {
                const color =
                  status === "normal"
                    ? "green"
                    : status === "mlc"
                      ? "orange"
                      : "red";
                const label =
                  status === "normal"
                    ? "Normal"
                    : status === "mlc"
                      ? "MLC"
                      : "Emergency";

                return (
                  <Col key={status}>
                    <span
                      onClick={() =>
                        status === "normal"
                          ? handleNormalClick()
                          : status === "mlc"
                            ? handleMLCClick()
                            : handleEmergencyClick()
                      }
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontWeight:
                          selectedStatus === status ? "bold" : "normal",
                        color: selectedStatus === status ? color : "inherit",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: color,
                          display: "inline-block",
                          boxShadow:
                            selectedStatus === status
                              ? `0 0 0 2px ${color}`
                              : "none",
                        }}
                      />
                      <span style={{ fontSize: "13px" }}>{label}</span>
                    </span>
                  </Col>
                );
              })}
            </Row>
          </Col>

          <Col span={6}>
            <Button
              block
              onClick={handleMLCClick}
              type="primary"
              style={{ marginTop: "30px" }}
            >
              MLC
            </Button>
          </Col>
        </Row>

        <Divider orientation="left">Admission Details</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="admitDate" label="Admit Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="billCategory" label="Bill Category">
              <Select placeholder="Select Category">
                {BILL_CATEGORY_OPTIONS.map((type) => (
                  <Option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="doctor"
              label="Admitting Doctor"
              rules={[{ required: true, message: "Please select a doctor" }]}
            >
              <Select placeholder="Select Doctor">
                {doctors.map((doc) => (
                  <Option key={doc.id} value={doc.id}>
                    {doc.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="reason" label="Reason">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="department" label="Department">
              <Select placeholder="Select Department">
                {DEPARTMENT_CHOICES.map((dep) => (
                  <Option key={dep.value} value={dep.value}>
                    {dep.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Kin Details</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="kinRelation" label="Kin Relation">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="kinName" label="Kin Name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="kinMobile" label="Mobile No.">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {showMLC && (
          <>
            <Divider orientation="left">MLC Information</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="policeStation" label="Police Station Details">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="informedOn" label="Informed On">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="mlcNo" label="MLC No.">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="mlcType" label="MLC Type">
                  <Select placeholder="Select Type">
                    <Option value="accident">Accident</Option>
                    <Option value="assault">Assault</Option>
                    <Option value="burn">Burn</Option>
                    <Option value="poisoning">Poisoning</Option>
                    <Option value="suicide">Suicide</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="incidentDateTime"
                  label="Incident Date & Time"
                >
                  <DatePicker showTime style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="mlcNote" label="Injury Details">
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            Submit Admission
          </Button>
        </Form.Item>
      </Form>

      <AssignBedModal
        visible={bedModalOpen}
        onClose={() => setBedModalOpen(false)}
        onAssign={(bedInfo) => setAssignedBed(bedInfo)}
      />
    </Modal>
  );
};

export default AddIPDModal;
