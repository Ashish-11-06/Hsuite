import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Spin, message, Input, Row, Col, Typography } from "antd";
import { useDispatch } from "react-redux";
import { getBirthReports } from "../Redux/Slices/ReportSlice";
import AddBirthReportModal from "../Modals/AddBirthReportModal";
import dayjs from "dayjs";

const { Title } = Typography;

const BirthReport = () => {
    const [visible, setVisible] = useState(false);
    const [birthReports, setBirthReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");

    const dispatch = useDispatch();
    // const createdById = 16;

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dispatch(getBirthReports()).unwrap();
            const reports = response?.data || [];
            setBirthReports(reports);
            setFilteredReports(reports);
        } catch (error) {
            message.error("Failed to load birth reports");
            console.error("Error fetching birth reports:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // Live search as user types
    useEffect(() => {
        const value = searchText.toLowerCase();
        const filtered = birthReports.filter(
            (report) =>
                report?.child_name?.toLowerCase().includes(value) ||
                report?.remark?.toLowerCase().includes(value)
        );
        setFilteredReports(filtered);
    }, [searchText, birthReports]);

    const columns = [
        {
            title: "Sr. No.",
            key: "index",
            render: (_text, _record, index) => index + 1,
        },
        {
            title: "Child Name",
            dataIndex: "child_name",
            key: "child_name",
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
        },
        {
            title: "DOB",
            dataIndex: "dob_child",
            key: "dob_child",
            render: (text) => dayjs(text).format("DD MMM YYYY, hh:mm A"),
        },
        {
            title: "Birth Place",
            dataIndex: "birth_place",
            key: "birth_place",
        },
        {
            title: "Father Name",
            dataIndex: "father_name",
            key: "father_name",
        },
        {
            title: "Weight (kg)",
            dataIndex: "weight",
            key: "weight",
        },
        {
            title: "Remark",
            dataIndex: "remark",
            key: "remark",
        },
    ];

    return (
        <>
            <Title level={3}>Birth Reports</Title>

            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8}>
                    <Input
                        placeholder="Search by child name or remark"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />
                </Col>
                <Col>
                    <Button type="primary" onClick={() => setVisible(true)}>
                        Add Birth Report
                    </Button>
                </Col>
            </Row>

            <AddBirthReportModal
                visible={visible}
                onClose={() => setVisible(false)}
                // createdById={createdById}
                onSuccess={fetchReports}
            />

            {loading ? (
                <Spin size="large">
                    <div style={{height: 100}}></div>
                </Spin>
            ) : (
                <Table
                    dataSource={filteredReports}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </>
    );
};

export default BirthReport;
