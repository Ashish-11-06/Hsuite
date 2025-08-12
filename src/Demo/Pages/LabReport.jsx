import React, { useState, useEffect } from "react";
import { Button, Table, message, Spin, Popconfirm } from "antd";
import { getLabReportsByAssistant, deleteLabReport } from "../Redux/Slices/ReportSlice";
import { useDispatch } from "react-redux";
import AddLabReport from "../Modals/AddLabReport";
import { BASE_URL } from "../Redux/API/demoaxiosInstance";

const LabReport = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [uploadedById, setUploadedById] = useState(null);
    const [labReports, setLabReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    // Get the user ID from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("HMS-user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUploadedById(parsedUser?.id);
            }
        } catch (error) {
            // console.error("Error reading user from localStorage:", error);
        }
    }, []);

    // Fetch lab reports manually using dispatch, and set them into local state
    useEffect(() => {
        const fetchReports = async () => {
            try {
                if (uploadedById) {
                    setLoading(true);
                    const response = await dispatch(getLabReportsByAssistant(uploadedById)).unwrap();
                    setLabReports(response?.lab_reports || []);
                }
            } catch (error) {
                message.error("Failed to fetch lab reports.");
                // console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [uploadedById, dispatch, modalVisible]); // re-fetch on modal close (after add)

    const handleDelete = async (reportId) => {
        try {
            await dispatch(deleteLabReport(reportId)).unwrap();
            setLabReports((prevReports) => prevReports.filter((r) => r.id !== reportId));
        } catch (error) {
            // console.error("Failed to delete report:", error);
            message.error("Failed to delete lab report.");
        }
    };

    const columns = [
        {
            title: "Report Name",
            dataIndex: "report_name",
            key: "report_name",
        },
        {
            title: "Patient Name",
            dataIndex: ["patient", "full_name"],
            key: "patient_name",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Download Report",
            key: "file",
            render: (_, record) => {
                const fileUrl = record.file.startsWith("http")
                    ? record.file
                    : `${BASE_URL}${record.file}`;

                return (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        View Report
                    </a>
                );
            },
        },
       {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this report?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="link" danger>
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <h2>Lab Reports</h2>

            <Button
                type="primary"
                onClick={() => setModalVisible(true)}
                disabled={!uploadedById}
                style={{ marginBottom: 16 }}
            >
                Add Lab Report
            </Button>

            <AddLabReport
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                uploadedById={uploadedById}
            />

            {loading ? (
                <Spin tip="Loading reports..." />
            ) : (
                <Table
                    dataSource={labReports}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default LabReport;
