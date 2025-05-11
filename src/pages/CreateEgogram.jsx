import React, { useEffect, useState } from "react";
import { Button, Select, Space, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AddEgoQuesModal from "../Modals/AddEgoQuesModal";
import {
  fetchStatementsByTestId,
  editStatement,
  deleteStatement,
} from "../Redux/Slices/egoSlice";
import EgogramTable from "./EgogramTable";

const { Option } = Select;

const CreateEgogram = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEgogram, setSelectedEgogram] = useState("");

  const dispatch = useDispatch();
  const { tests, statementsByTest } = useSelector((state) => state.ego);

  const selectedTest = Array.isArray(tests)
    ? tests.find((test) => test?.test_name === selectedEgogram)
    : null;

  const testId = selectedTest?.id;

  // ✅ Fetch statements when testId changes
  useEffect(() => {
    if (testId) {
      fetchStatements();
    }
  }, [dispatch, testId]);

  // ✅ Create refreshData function
  const fetchStatements = () => {
    if (testId) {
      dispatch(fetchStatementsByTestId(testId));
    }
  };

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <div style={{ padding: 24 }}>
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

        <Button type="primary" onClick={handleOpen}>
          Add Egogram Test
        </Button>
      </Space>

      <AddEgoQuesModal open={isModalOpen} onClose={handleClose} />

      {statementsByTest?.statements?.length > 0 && (
        <>
          <Divider />
          <EgogramTable
            statements={statementsByTest.statements}
            testId={testId}
            refreshData={fetchStatements} // ✅ Pass refreshData to child
          />
        </>
      )}
    </div>
  );
};

export default CreateEgogram;
