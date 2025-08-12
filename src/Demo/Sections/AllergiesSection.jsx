// src/Sections/AllergiesSection.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Typography, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddAllergyModal from "../Modals/AddAllergyModal";
import { GetAllDetailHistoryyy } from "../Redux/Slices/PatientSlice";

const { Text } = Typography;

const AllergiesSection = ({ patientId, allergies, setAllergies, setLoading, loading }) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formState, setFormState] = useState({
    allergen: "",
    reaction: "",
  });
  const currentUser = JSON.parse(localStorage.getItem("HMS-user"));
const canAdd = ["admin", "nurse", "doctor"].includes(currentUser?.designation);

  // ✅ Re-fetch after add success
  const handleSuccess = async () => {
    try {
      setLoading(true);
      const res = await dispatch(GetAllDetailHistoryyy(patientId)).unwrap();
      setAllergies(res.allergies || []);
    } catch (error) {
      // console.error("Failed to update allergies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        title={<span style={{ color: "#1890ff" }}>Allergies</span>}
        extra={
           canAdd && (
          <Button
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            type="primary"
            size="small"
          >
            Add
          </Button>
           )
        }
        style={{ borderRadius: 8 }}
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <Spin tip="Loading allergies..." spinning={loading} >
              <div style={{height: 100}}></div>
            </Spin>
          </div>
        ) : allergies?.length === 0 ? (
          <Text type="secondary">No allergies added yet.</Text>
        ) : (
          allergies.map((entry, idx) => (
            <Card
              key={entry.id || idx}
              size="small"
              type="inner"
              style={{ marginBottom: 12, borderRadius: 6 }}
              title={`Entry ${idx + 1}`}
            >
              <p><b>Name:</b> {entry.name || "-"}</p>
              <p><b>Description:</b> {entry.description || "-"}</p>
            </Card>
          ))
        )}
      </Card>


      <AddAllergyModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={handleSuccess}
        formState={formState}
        setFormState={setFormState}
        patientId={patientId}
      />
    </>
  );
};

export default AllergiesSection;
