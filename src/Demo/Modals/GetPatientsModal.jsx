import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Empty,
  Form,
  message,
  Select,
  Input,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import AddPatientModal from "./AddPatientModal";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";
import { GetAllUsers } from "../Redux/Slices/UsersSlice";
import { PostOPD } from "../Redux/Slices/OpdSlice";

const { TextArea } = Input;
const { Option } = Select;

const GetPatientsModal = ({ visible, onClose, onSelect }) => {
  const dispatch = useDispatch();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { allPatients } = useSelector((state) => state.patient);
  const { users } = useSelector((state) => state.users);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (visible) {
      dispatch(fetchAllPatients());
      dispatch(GetAllUsers());
      setSelectedPatient(null);
      setSelectedDoctor(null);
      setDescription("");
    }
  }, [dispatch, visible]);

  const handleAddFinish = (values) => {
    form.resetFields();
    setAddModalVisible(false);
    dispatch(fetchAllPatients());
  };

  const handleSubmit = () => {
    if (!selectedPatient || !selectedDoctor || !description.trim()) {
      message.warning("Please fill all fields.");
      return;
    }

    const data = {
      patient: selectedPatient,
      doctor: selectedDoctor,
      description: description.trim(),
    };

    dispatch(PostOPD(data)).then((res) => {
      onSelect?.();
    }).catch((err) => {
       message.error(err);
    });

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
        <Form layout="vertical">
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
                  {allPatients?.map((patient) => (
                    <Option key={patient.id} value={patient.id}>
                      {patient.full_name} - {patient.age} yrs
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
            <Button type="primary" block onClick={handleSubmit}>
              Submit OPD
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <AddPatientModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onFinish={handleAddFinish}
        form={form}
        isEditing={false}
      />
    </>
  );
};

export default GetPatientsModal;
