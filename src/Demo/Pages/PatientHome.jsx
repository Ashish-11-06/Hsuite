import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Spin, message } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { fetchPatientById } from "../Redux/Slices/PatientRegisterSlice";
import PatientBookAppointment from "./PatientBookAppointment";
import PatientPrescriptions from "./PatientPrescriptions";

const PatientHome = () => {
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [showPrescriptionForm, setPrescriptionsForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState(null);

    const { hospitalId } = useParams();
    const dispatch = useDispatch();

    const patientData = JSON.parse(localStorage.getItem("patient-user"));
    const patientId = patientData?.id;

    useEffect(() => {
        const getPatientDetails = async () => {
            // console.log("patientId:", patientId);
            setLoading(true);
            try {
                const response = await dispatch(fetchPatientById(patientId)).unwrap();
                // console.log("Dispatching fetchPatientById with:", patientId);
                setPatient(response.data);
            } catch (error) {
                message.error("Failed to fetch patient data.");
                // console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            getPatientDetails();
        }
    }, [dispatch, patientId]);

    const handleBookAppointment = () => {
        setShowAppointmentForm(true);
    };

    const handleViewPrescriptions = () => {
        setPrescriptionsForm(true);
    };

    return (
        <div style={{ padding: "20px" }}>
            {loading ? (
                <Spin />
            ) : showAppointmentForm ? (
                <PatientBookAppointment hospitalId={hospitalId} />
            ) : showPrescriptionForm ? (
                <PatientPrescriptions patientId={patientId} />
            ) : (
                <>
                    {patient?.full_name && (
                        <>
                            <h1 style={{ fontSize: "36px", margin: 0 }}>Hello,</h1>
                            <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "8px" }}>
                                {patient.full_name}
                            </h1>
                        </>
                    )}

                    <div style={{ marginTop: "20px" }}>
                        <Button
                            type="primary"
                            onClick={handleBookAppointment}
                            style={{ width: "100%", marginBottom: "10px" }}
                        >
                            Book Appointment
                        </Button>

                        <Button
                            onClick={handleViewPrescriptions}
                            icon={<FileTextOutlined />}
                            style={{
                                height: "50px",         // bigger height
                                width: "180px",         // smaller width (rectangular)
                                borderRadius: "8px",    // optional rounded corners
                                fontWeight: "500",
                                fontSize: "16px"
                            }}
                        >
                            Prescriptions
                        </Button>
                    </div>
                </>

            )}
        </div>
    );
};

export default PatientHome;
