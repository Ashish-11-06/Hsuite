import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, Space, Divider, Input, Typography, Row, Col, Spin, Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AddEgoQuesModal from "../Modals/AddEgoQuesModal";
import {
  fetchStatementsByTestId,
  fetchAllEgogramTests,
} from "../Redux/Slices/egoSlice";
import { PlusSquareOutlined, OrderedListOutlined, ArrowLeftOutlined} from "@ant-design/icons";
import EgogramTable from "./EgogramTable";
import EgogramStepsModal from "../Modals/EgogramStepsModal";

const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;

const CreateEgogram = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false);
  const [selectedEgogram, setSelectedEgogram] = useState("");
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
    const navigate = useNavigate();
  const { tests, statementsByTest, loading } = useSelector((state) => state.ego);

  const selectedTest = Array.isArray(tests)
    ? tests.find((test) => test?.test_name === selectedEgogram)
    : null;

  const testId = selectedTest?.id;

  // Filter statements based on search text
  const filteredStatements = statementsByTest?.statements?.filter(statement => {
    return (
      statement.statement.toLowerCase().includes(searchText.toLowerCase()) ||
      (statement.category_name && statement.category_name.toLowerCase().includes(searchText.toLowerCase()))
    );
  });

  useEffect(() => {
    if (testId) {
      fetchStatements();
    }
    if (!tests || tests.length === 0) {
      dispatch(fetchAllEgogramTests());
    }
  }, [dispatch, testId]);

  const fetchStatements = () => {
    if (testId) {
      dispatch(fetchStatementsByTestId(testId));
    }
  };

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  const showStepsModal = () => setIsStepsModalOpen(true);
  const handleStepsModalClose = () => setIsStepsModalOpen(false);

  return (
    <>
   <div style={{ position: "relative", margin: "20px" }}>
  <Button
    icon={<ArrowLeftOutlined />}
    type="primary"
    onClick={() => navigate(-1)}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      // fontSize: "40px",
      color: "white",
    }}
  >Back</Button>
</div>
    <div style={{ 
      maxWidth: "1200px", 
      margin: "40px",
      marginTop: "70px",
      padding: "0 20px",
      minHeight: "calc(100vh - 40px)"
    }}>
      {/* Search row */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Search
            placeholder="Search statements or categories"
            allowClear
            enterButton="Search"
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {/* Filter and action buttons row */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col xs={24} md={12}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Select Egogram:</label>
            <Select
              showSearch
              placeholder="Search Egogram Test"
              style={{ width: "100%" }}
              value={selectedEgogram || undefined}
              onChange={(value) => setSelectedEgogram(value)}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {Array.isArray(tests) &&
                tests
                  .filter((test) => test && test.test_name)
                  .map((test) => (
                    <Option key={test.id} value={test.test_name}>
                      {test.test_name}
                    </Option>
                  ))}
            </Select>
          </div>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: "right", marginTop: { xs: "16px", md: "0" } }}>
          <div style={{ display: "inline-flex", gap: "10px" }}>
            <Button
              icon={<PlusSquareOutlined />}
              onClick={handleOpen}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                color: "#fff",
                backgroundColor: "#1890ff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                minWidth: "120px"
              }}
            >
              Add Test
            </Button>

            <Button
              icon={<OrderedListOutlined />}
              onClick={showStepsModal}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                color: "#fff",
                backgroundColor: "#722ed1",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                minWidth: "120px"
              }}
            >
              Add Steps
            </Button>
          </div>
        </Col>
      </Row>

      {/* Modals */}
      <AddEgoQuesModal open={isModalOpen} onClose={handleClose} />
      
      <EgogramStepsModal 
        visible={isStepsModalOpen}
        onCancel={handleStepsModalClose}
        onSuccess={handleStepsModalClose}
      />

      {/* Content area */}
      {testId ? (
        <div style={{ margin: "20px 0" }}>
          {(filteredStatements?.length > 0 || statementsByTest?.statements?.length > 0) && (
            <EgogramTable
              statements={searchText ? filteredStatements : statementsByTest.statements}
              testId={testId}
              refreshData={fetchStatements}
            />
          )}
        </div>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          textAlign: "center",
        }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary" style={{ fontSize: "16px" }}>
                ⚠️ Please select an egogram from the dropdown <br></br>to view statements
              </Text>
            }
          />
        </div>
      )}
    </div>
    </>
  );
};

export default CreateEgogram;