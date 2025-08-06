import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Form,
  message,
  Select,
  Input,
  Switch,
} from "antd";
import { useDispatch } from "react-redux";
import AddPatientModal from "./AddPatientModal";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";
import { GetAvaliableDoctors } from "../Redux/Slices/UsersSlice";
import { PostOPD } from "../Redux/Slices/OpdSlice";

const { TextArea } = Input;
const { Option } = Select;

const GetPatientsModal = ({ visible, onClose, onSelect }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // Local states
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [description, setDescription] = useState("");
  const [opdType, setOpdType] = useState("normal");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch patients and users manually via thunk in try/catch
  useEffect(() => {
    if (visible) {
      const fetchData = async () => {
        try {
          const patientData = await dispatch(fetchAllPatients()).unwrap();
          const userData = await dispatch(GetAvaliableDoctors()).unwrap();
          setPatients(Array.isArray(patientData.patients) ? patientData.patients : []);
          setUsers(Array.isArray(userData.available_doctors) ? userData.available_doctors : []);
        } catch (err) {
          // console.error("Error fetching data:", err);
          message.error("Failed to load patient or user data");
        }

        setSelectedPatient(null);
        setSelectedDoctor(null);
        setDescription("");
        setOpdType("normal");
      };

      fetchData();
    }
  }, [visible, dispatch]);

  const handleAddFinish = (newPatientId) => {
    setAddModalVisible(false);
    dispatch(fetchAllPatients())
      .unwrap()
      .then((data) => {
        setPatients(data || []);setPatients(Array.isArray(data.patients) ? data.patients : []);
        if (newPatientId) setSelectedPatient(newPatientId);
      })
      .catch(() => {
        message.error("Failed to refresh patients");
      });
  };

  const handleSubmit = async () => {
    if (!selectedPatient || !selectedDoctor || !description.trim()) {
      message.warning("Please fill all fields.");
      return;
    }

    const data = {
      patient: selectedPatient,
      doctor: selectedDoctor,
      description: description.trim(),
      opd_type: opdType,
    };

    setSubmitting(true);

    try {
      await dispatch(PostOPD(data)).unwrap();
      onSelect?.();
      onClose?.();
    } catch (err) {
      message.error(err?.message || "Failed to submit OPD");
    } finally {
      setSubmitting(false);
    }
  };

  const doctorOptions = users?.filter((u) => u.designation === "doctor") || [];

  return (
    <>
      <Modal
        title="Add Patient to OPD"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="OPD Type">
            <Switch
              checkedChildren="Normal"
              unCheckedChildren="Emergency"
              checked={opdType === "normal"}
              onChange={(checked) => setOpdType(checked ? "normal" : "emergency")}
              className="opd-type-switch"
              style={{
                backgroundColor: opdType === "normal" ? "#52c41a" : "#ff4d4f",
              }}
            />
          </Form.Item>

          <Form.Item label="Select Patient">
            <Row gutter={8} align="middle">
              <Col flex="auto">
                <Select
                  showSearch
                  placeholder="Select a patient"
                  optionFilterProp="children"
                  value={selectedPatient}
                  onChange={(value) => setSelectedPatient(value)}
                  style={{ width: "100%" }}
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {patients?.map((patient) => (
                    <Option key={patient.id} value={patient.id}>
                      {patient.patient_id} - {patient.full_name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col>
                <Button type="default" onClick={() => setAddModalVisible(true)}>
                  Add Patient
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="Description">
            <TextArea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter OPD visit description"
            />
          </Form.Item>

          <Form.Item label="Assign Doctor">
            <Select
              showSearch
              placeholder="Select a doctor"
              optionFilterProp="children"
              value={selectedDoctor}
              onChange={(value) => setSelectedDoctor(value)}
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {doctorOptions?.map((doc) => (
                <Option key={doc.id} value={doc.id}>
                  {doc.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              onClick={handleSubmit}
              loading={submitting}
            >
              Submit OPD
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <AddPatientModal
        visible={addModalVisible}
        onCancel={(newPatientId) => {
          setAddModalVisible(false);
          if (newPatientId) handleAddFinish(newPatientId);
        }}
        onFinish={handleAddFinish}
        form={form}
        isEditing={false}
      />
    </>
  );
};

export default GetPatientsModal;
