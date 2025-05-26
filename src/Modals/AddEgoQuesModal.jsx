import React, { useEffect, useState, useMemo } from "react";
import { Modal, Typography, Select, Button, Row, Col, Space, message, Spin, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AddNewEgoNameModal from "./AddNewEgoNameModal";
import AddEgoStateModal from "./AddEgoStateModal";
import {
  fetchAllEgogramTests,
  fetchAllEgogramStatements,
  addStatementsToEgogramTest,
  fetchAllEgogramCategories,
  clearEgoState
} from "../Redux/Slices/egoSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const AddEgoQuesModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { tests, statements, loading, error, success } = useSelector((state) => state.ego);

  const [newModalOpen, setNewModalOpen] = useState(false);
  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const [selectedEgogramName, setSelectedEgogramName] = useState(null);
  const [selectedStatement, setSelectedStatement] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usedCategories, setUsedCategories] = useState(new Set());
   const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [statementsPerCategory, setStatementsPerCategory] = useState(0);

  // Clear messages when modal opens/closes
  useEffect(() => {
    if (open) {
      dispatch(clearEgoState());
      message.destroy(); // Clear all messages
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (open) {
      dispatch(fetchAllEgogramTests());
      dispatch(fetchAllEgogramCategories()).then((res) => {
        if (res.payload?.categories) {
          setCategories(res.payload.categories);
        }
      });
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (selectedEgogramName) {
      dispatch(fetchAllEgogramStatements());
    }
  }, [dispatch, selectedEgogramName]);

  // Calculate categories from selected statements
  useEffect(() => {
  const categoriesInUse = new Set();
  selectedStatement.forEach(statementId => {
    const statement = statements.find(s => s.id === statementId);
    if (statement && statement.category) {
      categoriesInUse.add(statement.category);
    }
  });
  setUsedCategories(categoriesInUse);
}, [selectedStatement, statements]);

   useEffect(() => {
    if (statements.length > 0) {
      // setStatementsPerCategory(Math.floor(statements.length / 4));
      setStatementsPerCategory(5);
    }
  }, [statements]);

   // Filter statements based on category selection limits
 const filteredStatements = useMemo(() => {
  const categoryCounts = {};
  selectedCategories.forEach(catId => {
    categoryCounts[catId] = selectedStatement.filter(id => {
      const stmt = statements.find(s => s.id === id);
      return stmt && stmt.category === catId;
    }).length;
  });

 return statements
  .filter(statement => statement && typeof statement.category !== 'undefined') // safeguard
  .map(statement => {
    const isCategorySelected = selectedCategories.has(statement.category);
    const currentCount = categoryCounts[statement.category] || 0;

    const isDisabled =
      !selectedStatement.includes(statement.id) &&
      ((!isCategorySelected && selectedCategories.size >= 4) ||
        (isCategorySelected && currentCount >= statementsPerCategory));

    return {
      ...statement,
      disabled: isDisabled,
    };
  });

}, [statements, selectedStatement, selectedCategories, statementsPerCategory]);


  const handleStatementSelection = (values) => {
    // Determine which categories are being used
    const newCategories = new Set();
    const newCategoryCounts = {};
    
    values.forEach(id => {
      const stmt = statements.find(s => s.id === id);
      if (stmt?.category) {
        newCategories.add(stmt.category);
        newCategoryCounts[stmt.category] = (newCategoryCounts[stmt.category] || 0) + 1;
      }
    });

    // Check if any category exceeds its limit
    const wouldExceedLimit = Object.entries(newCategoryCounts).some(
      ([catId, count]) => count > statementsPerCategory
    );

    if (wouldExceedLimit) {
      message.warning(`Maximum ${statementsPerCategory} statements per category allowed`);
      return;
    }

    if (newCategories.size > 4) {
      message.warning('Maximum 4 categories allowed');
      return;
    }

    setSelectedCategories(newCategories);
    setSelectedStatement(values);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.category : "No category";
  };

  const handleAddNewNameClick = () => {
    setNewModalOpen(true);
  };

  const handleAddNewStatementClick = () => {
    setStatementModalOpen(true);
  };

  const handleAddStatementToTest = () => {
  // Clear any existing messages first
  message.destroy();
  
  dispatch(
    addStatementsToEgogramTest({
      test_id: selectedEgogramName,
      statement_ids: selectedStatement,
    })
  ).then((res) => {
    if (res.error) {
      message.error("Failed to add statements");
    } else {
      message.success("Statements added successfully");
      setSelectedStatement([]);
      onClose();
    }
  });
};

  const selectedTest = Array.isArray(tests)
    ? tests.find((test) => test?.id === selectedEgogramName)
    : null;

  return (
    <>
      <Modal
        width={600}
        title="Add Egogram Test"
        visible={open}
        onCancel={onClose}
        styles={{ body: { maxHeight: "60vh", overflowY: "auto" } }}
        footer={[
          <Button key="back" onClick={onClose}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={handleAddStatementToTest}
            disabled={!selectedStatement.length || !selectedEgogramName || loading}
          >
            {loading ? <Spin size="small" /> : "Add Statement to Test"}
          </Button>,
        ]}
      >
        <Title level={5}>Add Egogram Name</Title>

        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Button 
              onClick={handleAddNewNameClick} 
              type="primary"
              disabled={loading}
            >
              Add New Name
            </Button>
          </Col>
          <Col>
            <Space>
              <span>Existing Names</span>
              <Select
                placeholder="Select Egogram Name"
                style={{ width: 200 }}
                onChange={(value) => setSelectedEgogramName(value)}
                value={selectedEgogramName || undefined}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                disabled={loading}
              >
                {Array.isArray(tests) && tests.length > 0 ? (
                  tests.map((test, index) =>
                    test && test.test_name ? (
                      <Option key={test.id || index} value={test.id}>
                        {test.test_name}
                      </Option>
                    ) : null
                  )
                ) : (
                  <Option disabled>No Egogram tests available</Option>
                )}
              </Select>
            </Space>
          </Col>
        </Row>

        {selectedEgogramName && (
          <div style={{ marginBottom: 24 }}>
            <strong>Selected Egogram:</strong>{" "}
            {selectedTest?.test_name || "Unknown"}
          </div>
        )}

        <Title level={5}>Add Statement</Title>

        <Row gutter={16} align="middle">
          <Col>
            <Button
              onClick={handleAddNewStatementClick}
              type="dashed"
              style={{ color: "#52c41a", borderColor: "#52c41a" }}
              disabled={loading}
            >
              Add New Statement
            </Button>
          </Col>
          <Col>
            <Space>
              <span>Existing Statements</span>
              <Select
  mode="multiple"
  placeholder="Select Statement"
  style={{ width: 350 }}
  onChange={handleStatementSelection}
  value={selectedStatement || undefined}
  showSearch
  filterOption={(input, option) =>
    option.children.props.children[0]
      .toLowerCase()
      .includes(input.toLowerCase())
  }
  optionLabelProp="truncatedLabel" // Use custom truncated label
  disabled={loading}
  maxTagCount="responsive"
  tagRender={(props) => ( // Custom render for selected tags
    <Tag 
      closable={props.closable}
      onClose={props.onClose}
      style={{ marginRight: 4 }}
    >
      {props.label.length > 3 
        ? `${props.label.substring(0, 3)}...` 
        : props.label}
    </Tag>
  )}
>
  {Array.isArray(filteredStatements) &&
    filteredStatements.map((statement) =>
      statement && statement.statement ? (
        <Option
          key={statement.id}
          value={statement.id}
          label={statement.statement} // Full label for dropdown
          truncatedLabel={ // First 3 letters for selected display
            statement.statement.length > 3
              ? `${statement.statement.substring(0, 3)}...`
              : statement.statement
          }
        >
          <div>
            {statement.statement} {/* Full text in dropdown */}
            <span style={{ color: "#bfbfbf", marginLeft: "8px" }}>
              ({getCategoryName(statement.category)})
              {statement.disabled && " (limit reached)"}
            </span>
          </div>
        </Option>
      ) : null
    )}
</Select>
            </Space>
          </Col>
   <div style={{ marginTop: 8 }}>
        <Text type="secondary">
          Categories: {selectedCategories.size}/4 | 
          Statements per category: {selectedStatement.length > 0 ? 
            Math.floor(selectedStatement.length / selectedCategories.size) || 0 : 0}
        </Text>
        {selectedCategories.size > 0 && (
          <div style={{ marginTop: 4 }}>
            {Array.from(selectedCategories).map(catId => {
              const cat = categories.find(c => c.id === catId);
              const count = selectedStatement.filter(id => {
                const stmt = statements.find(s => s.id === id);
                return stmt?.category === catId;
              }).length;
              
              return cat ? (
                <Tag color="blue" key={catId} style={{ marginRight: 4 }}>
                  {cat.category} ({count}/{statementsPerCategory})
                </Tag>
              ) : null;
            })}
          </div>
        )}
      </div>
        </Row>

        {selectedStatement.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <strong>Selected Statements:</strong>
            <ul>
              {selectedStatement.map((id, index) => {
                const statementObj = statements.find((s) => s.id === id);
                return (
                  <li key={index}>
                    {statementObj?.statement}
                    <span style={{ color: "#bfbfbf", marginLeft: "8px" }}>
                      ({getCategoryName(statementObj?.category)})
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Modal>

      <AddNewEgoNameModal
        open={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        onNewNameAdded={(newNameId) => {
          setSelectedEgogramName(newNameId);
          dispatch(fetchAllEgogramTests());
        }}
      />
      <AddEgoStateModal
        open={statementModalOpen}
        onClose={() => {
          setStatementModalOpen(false);
          dispatch(fetchAllEgogramStatements());
        }}
      />
    </>
  );
};

export default AddEgoQuesModal;