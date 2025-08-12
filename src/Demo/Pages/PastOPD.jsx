import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Table, Spin, Typography, Input, DatePicker, Row, Col, message } from "antd";
import { GetPastOPD, GetAllPastOPD } from "../Redux/Slices/OpdSlice";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const PastOPD = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allRecords, setAllRecords] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([]);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("HMS-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch OPD records
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        let result;

        if (user.designation?.toLowerCase() === "doctor" && user?.id) {
          result = await dispatch(GetPastOPD(user.id)).unwrap();
        } else {
          // Admin or others
          result = await dispatch(GetAllPastOPD()).unwrap();
        }

        if (result?.data) {
          setAllRecords(result.data);
        }
      } catch (error) {
        // console.error("Failed to fetch OPD records:", error);
        message.error("Failed to fetch OPD records");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filter records
  useEffect(() => {
    const lowerSearch = searchText.toLowerCase();

    const filtered = allRecords.filter((record) => {
      const patientName = record?.patient?.full_name?.toLowerCase() || "";
      const matchesName = patientName.includes(lowerSearch);

      const recordDate = dayjs(record.date_time);
      const matchesDate =
        dateRange.length === 0 ||
        (recordDate.isAfter(dateRange[0], "day") || recordDate.isSame(dateRange[0], "day")) &&
        (recordDate.isBefore(dateRange[1], "day") || recordDate.isSame(dateRange[1], "day"));

      return matchesName && matchesDate;
    });

    setFilteredData(filtered);
  }, [allRecords, searchText, dateRange]);

  const columns = [
    {
      title: "Sr. No",
      key: "srno",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Patient Name",
      dataIndex: ["patient", "full_name"],
      key: "name",
    },
    {
      title: "Date & Time",
      dataIndex: "date_time",
      key: "datetime",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "OPD Type",
      dataIndex: "opd_type",
      key: "opd_type",
      render: (type) => type?.charAt(0).toUpperCase() + type?.slice(1),
    },
    {
      title: "Visit Count",
      dataIndex: "visit_count",
      key: "visit_count",
    },
  ];


  return (
    <div>
      <Title level={4}>Past OPD Records</Title>

      <Row gutter={16} style={{ marginBottom: 16, justifyContent: "flex-start" }}>
        <Col>
          <Input
            placeholder="Search by patient name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 220 }}
          />
        </Col>
        <Col>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates || [])}
            allowClear
          />
        </Col>
      </Row>

      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default PastOPD;
