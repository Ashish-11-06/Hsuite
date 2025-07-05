import React, { useState } from "react";
import { Card, Button, Typography, List, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AddOngoingMedicationModal from "../Modals/AddOngoingMedicationModal";
import { useSelector } from "react-redux";

const { Text } = Typography;

const OngoingMedicationSection = ({
  patientId,
  ongoingMedication,
  diseases,
  setOngoingMedication,
  setLoading,
  loading
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("HMS-user"));
const canAdd = ["admin", "nurse"].includes(currentUser?.designation);

  const getDiseaseName = (id) => {
    const disease = diseases?.find((d) => d.id === id);
    return disease ? disease.disease_name : `Disease #${id}`;
  };

  return (
    <>
      <Card
        title={<span style={{ color: "#1890ff" }}>Ongoing Medication</span>}
        extra={
           canAdd && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="small"
            onClick={() => setModalVisible(true)}
          >
            Add
          </Button>
           )
        }
        style={{ borderRadius: 8 }}
      >
        {loading ? (
          <div style={{display:"flex", justifyContent: "center", padding:"20px"}}>
            <Spin tip="Loading Ongoing Medications..." spinning={loading} >
              <div style={{height: 1}} />
            </Spin>
          </div>
        ):
        ongoingMedication && ongoingMedication.length > 0 ? (
          <List
            dataSource={ongoingMedication}
            renderItem={(item) => (
              <List.Item>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text strong>
                    {item.medicine_name}
                    {item.dosage_amount ? ` (${item.dosage_amount}${item.dosage_unit || ""})` : ""} — {item.type}
                  </Text>

                  <Text type="secondary">
                    Frequency: {item.frequency.replace(/_/g, " ")}
                  </Text>

                  {item.diseases_name && (
                    <Text type="secondary">
                      Disease: {getDiseaseName(item.diseases_name)}
                    </Text>
                  )}

                  {item.notes && (
                    <Text type="secondary">
                      Notes: {item.notes}
                    </Text>
                  )}

                  {item.start_date && (
                    <Text type="secondary">
                      Start Date: {dayjs(item.start_date).format("DD-MM-YYYY")}
                    </Text>
                  )}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">No ongoing medication found for this patient.</Text>
        )}
      </Card>

      <AddOngoingMedicationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        patientId={patientId}
        onSuccess={() => setModalVisible(false)}
        setOngoingMedication={setOngoingMedication}
        setLoading={setLoading}
      />
    </>
  );
};

export default OngoingMedicationSection;
