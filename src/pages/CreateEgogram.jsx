import React, { useEffect, useState } from "react";
import { Button, Select, Space, Divider, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AddEgoQuesModal from "../Modals/AddEgoQuesModal";
import {
  fetchStatementsByTestId,
  editStatement,
  deleteStatement,
} from "../Redux/Slices/egoSlice";
import { PlusSquareOutlined } from "@ant-design/icons";
import EgogramTable from "./EgogramTable";

const { Option } = Select;
const { Search } = Input;

const CreateEgogram = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEgogram, setSelectedEgogram] = useState("");
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  const { tests, statementsByTest } = useSelector((state) => state.ego);

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
  }, [dispatch, testId]);

  const fetchStatements = () => {
    if (testId) {
      dispatch(fetchStatementsByTestId(testId));
    }
  };

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Search Bar */}
        <Search
          placeholder="Search statements or categories"
          allowClear
          enterButton="Search"
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        
        <Space>
          <Select
            showSearch
            placeholder="Search Egogram Test"
            style={{ width: 300 }}
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

          <Button  icon={<PlusSquareOutlined />} type="primary" onClick={handleOpen}>
            Add Egogram Test
          </Button>
        </Space>
      </Space>

      <AddEgoQuesModal open={isModalOpen} onClose={handleClose} />

      {(filteredStatements?.length > 0 || statementsByTest?.statements?.length > 0) && (
        <>
          <EgogramTable
            statements={searchText ? filteredStatements : statementsByTest.statements}
            testId={testId}
            refreshData={fetchStatements}
          />
        </>
      )}
    </div>
  );
};

export default CreateEgogram;