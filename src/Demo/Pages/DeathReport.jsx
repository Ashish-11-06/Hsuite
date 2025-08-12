import React, { useEffect, useState } from "react";
import { Button, Table, message, Spin, Row, Col, Input, Typography } from "antd";
import { useDispatch } from "react-redux";
import { getDeathReports } from "../Redux/Slices/ReportSlice";
import AddDeathReportModal from "../Modals/AddDeathReportModal";
import dayjs from "dayjs";

const { Title } = Typography;

const DeathReport = () => {
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await dispatch(getDeathReports()).unwrap();
            const data = res?.data || [];
            setReports(data);
            setFilteredReports(data);
        } catch (error) {
            message.error("Failed to fetch death reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        const value = searchText.toLowerCase();
        const filtered = reports.filter((report) =>
            report?.patient?.full_name?.toLowerCase().includes(value)
        );
        setFilteredReports(filtered);
    }, [searchText, reports]);

    const columns = [
        {
            title: "Sr No",
            key: "index",
            render: (_text, _record, index) => index + 1,
        },
        {
            title: "Patient Name",
            dataIndex: "patient",
            render: (patient) => patient?.full_name || "N/A",
        },
        {
            title: "Date of Death",
            dataIndex: "date_of_death",
            render: (text) => dayjs(text).format("YYYY-MM-DD"),
        },
        {
            title: "Gender",
            dataIndex: "gender",
        },
        {
            title: "Cause of Death",
            dataIndex: "cause_of_death",
        },
        {
            title: "Remark",
            dataIndex: "remark",
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm"),
        },
    ];

    return (
        <>
            <Title level={3}>Death Reports</Title>

            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8}>
                    <Input
                        placeholder="Search by patient name"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />
                </Col>
                <Col>
                    <Button type="primary" onClick={() => setModalVisible(true)}>
                        Add Death Report
                    </Button>
                </Col>
            </Row>

            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={filteredReports}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Spin>

            <AddDeathReportModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onSuccess={fetchReports}
            />
        </>
    );
};

export default DeathReport;
