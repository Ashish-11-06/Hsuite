import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Spin, Typography, Empty } from "antd";
import { fetchAllPatients } from "../Redux/Slices/PatientSlice";
import PatientBill from "./PatientBill";

const { Option } = Select;
const { Title } = Typography;

const Billing = () => {
    const dispatch = useDispatch();
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    const allPatientsState = useSelector((state) => state.patient);
    const patients = allPatientsState.allPatients || [];
    const loading = allPatientsState.loading;

    const selectedPatient = patients.find((p) => p.id === selectedPatientId);

    useEffect(() => {
        dispatch(fetchAllPatients());
    }, [dispatch]);

    return (
        <div
            style={{
                padding: 24,
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Title level={3}>Billing</Title>

            {loading ? (
                <Spin tip="Loading Patients..." />
            ) : (
                <Select
                    placeholder="Select a Patient name, contact and patient-Id"
                    style={{ width: 400 }}
                    showSearch
                    value={selectedPatientId}
                    onChange={setSelectedPatientId}
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {patients.map((patient) => (
                        <Option
                            key={patient.id}
                            value={patient.id}
                            label={`${patient.full_name} (${patient.patient_id}) (${patient.contact_number})`}
                        >
                            {patient.patient_id} - {patient.full_name} ({patient.contact_number})
                        </Option>
                    ))}
                </Select>
            )}

            <div style={{ flex: 1, marginTop: 24, width: "100%" }}>
                {selectedPatient ? (
                    <div style={{ maxWidth: "100%", width: "100%" }}>
                        <PatientBill patient={selectedPatient} />
                    </div>
                ) : (
                    <Empty description="Please Select the Patient" style={{ fontSize: 18 }} />
                )}
            </div>

        </div>
    );
};

export default Billing;
