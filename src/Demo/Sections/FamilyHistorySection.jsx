import React, { useState } from "react";
import { Card, Modal, Input, Button, Typography, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { PostFamilyHistory } from "../Redux/Slices/PatientHistorySlice";
import { GetAllDetailHistoryyy } from "../Redux/Slices/PatientSlice";

const { Text } = Typography;

const FamilyHistorySection = ({ familyHistory, patientId, setFamilyHistory, setLoading, loading }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false); // <-- Added form loading
  const [form, setForm] = useState({
    relation: "",
    name: "",
    disease: "",
    description: "",
    period: "",
  });
  const currentUser = JSON.parse(localStorage.getItem("HMS-user"));
const canAdd = ["admin", "nurse", "doctor"].includes(currentUser?.designation);

  const handleSubmit = async () => {
    const payload = {
      patient: patientId,
      ...form,
    };

    setFormLoading(true); // start loading
    try {
      const response = await dispatch(PostFamilyHistory(payload)).unwrap();
      setVisible(false);
      setForm({
        relation: "",
        name: "",
        disease: "",
        description: "",
        period: "",
      });
      setLoading(true);
      if (response) {
        const res = await dispatch(GetAllDetailHistoryyy(patientId)).unwrap();
        setFamilyHistory(res.family_history || []);
        setLoading(false);
      }
    } catch (error) {
      message.error("Failed to add family history");
    } finally {
      setFormLoading(false); // end loading
    }
  };

  return (
    <Card
      title={<span style={{ color: "#1890ff" }}>Family History</span>}
      extra={
        canAdd && (
        <Button icon={<PlusOutlined />} type="primary" size="small" onClick={() => setVisible(true)}>
          Add
        </Button>
        )
      }
      style={{ borderRadius: 8 }}
    >

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin tip="Loading family history" spinning={loading}>
            <div style={{height: 1}}></div>
          </Spin> 
        </div>
      ) : Array.isArray(familyHistory) && familyHistory.length > 0 ? (
        familyHistory.map((entry, idx) => (
          <Card
            key={idx}
            size="small"
            type="inner"
            style={{ marginBottom: 12 }}
            title={`Entry ${idx + 1}`}
          >
            <p><b>Relation:</b> {entry.relation}</p>
            <p><b>Name:</b> {entry.name}</p>
            <p><b>Disease:</b> {entry.disease}</p>
            <p><b>Description:</b> {entry.description || "-"}</p>
            <p><b>Period:</b> {entry.period}</p>
          </Card>
        ))
      ) : (
        <Text type="secondary">No family history records found for this patient.</Text>
      )}

      <Modal
        open={visible}
        title="Add Family History"
        onCancel={() => setVisible(false)}
        onOk={handleSubmit}
        okText="Save"
        confirmLoading={formLoading} // <-- Show loading spinner on OK button
      >
        <label>Relation</label>
        <Input
          placeholder="Relation (e.g. Father, Mother)"
          value={form.relation}
          onChange={(e) => setForm({ ...form, relation: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <label>Name</label>
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <label>Disease</label>
        <Input
          placeholder="Disease"
          value={form.disease}
          onChange={(e) => setForm({ ...form, disease: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <label>Description (optional)</label>
        <Input.TextArea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          style={{ marginBottom: 8 }}
        />
        <label>Period</label>
        <Input
          placeholder="Period (e.g. 2015 - Present)"
          value={form.period}
          onChange={(e) => setForm({ ...form, period: e.target.value })}
        />
      </Modal>
    </Card>
  );
};

export default FamilyHistorySection;
