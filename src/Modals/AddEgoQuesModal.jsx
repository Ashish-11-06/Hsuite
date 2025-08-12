import React, { useEffect, useState, useMemo } from "react";
import { Modal, Typography, Select, Button, Row, Col, Space, message, Spin, Tag, Tooltip } from "antd";
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
import AddEgoCatModal from "./AddEgoCatModal";

const { Title, Text } = Typography;
const { Option } = Select;

const AddEgoQuesModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { tests, statements, loading, error, success } = useSelector((state) => state.ego);

  const [newModalOpen, setNewModalOpen] = useState(false);
  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedEgogramName, setSelectedEgogramName] = useState(null);
  const [selectedStatement, setSelectedStatement] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usedCategories, setUsedCategories] = useState(new Set());
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [statementsPerCategory, setStatementsPerCategory] = useState(null);

  // Clear messages when modal opens/closes
  useEffect(() => {
    if (open) {
      dispatch(clearEgoState());
      message.destroy();
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

  // Calculate categories from selected statements and check statement counts
  useEffect(() => {
    const categoriesInUse = new Set();
    const categoryCounts = {};
    
    selectedStatement.forEach(statementId => {
      const statement = statements.find(s => s.id === statementId);
      if (statement && statement.category) {
        categoriesInUse.add(statement.category);
        categoryCounts[statement.category] = (categoryCounts[statement.category] || 0) + 1;
      }
    });

    setUsedCategories(categoriesInUse);
    setSelectedCategories(categoriesInUse);

    if (categoriesInUse.size > 0) {
      const counts = Object.values(categoryCounts);
      const allSame = counts.every(val => val === counts[0]);
      setStatementsPerCategory(allSame ? counts[0] : null);
    } else {
      setStatementsPerCategory(null);
    }
  }, [selectedStatement, statements]);

  const filteredStatements = useMemo(() => {
    return statements
      .filter(statement => statement && typeof statement.category !== 'undefined')
      .map(statement => ({
        ...statement,
        disabled: false
      }));
  }, [statements]);

  const handleStatementSelection = (values) => {
    setSelectedStatement(values);
    const newCategories = new Set();
    values.forEach(id => {
      const stmt = statements.find(s => s.id === id);
      if (stmt?.category) newCategories.add(stmt.category);
    });
    setSelectedCategories(newCategories);
  };

  const getCategoryName = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId)?.category || "No category";
  };

  const handleAddStatementToTest = () => {
    message.destroy();
    
    const categoryCounts = {};
    selectedStatement.forEach(id => {
      const stmt = statements.find(s => s.id === id);
      if (stmt?.category) {
        categoryCounts[stmt.category] = (categoryCounts[stmt.category] || 0) + 1;
      }
    });

    const counts = Object.values(categoryCounts);
    const allSame = counts.length > 0 && counts.every(val => val === counts[0]);

    if (!allSame) {
      message.error("All categories must have the same number of statements");
      return;
    }

    dispatch(addStatementsToEgogramTest({
      test_id: selectedEgogramName,
      statement_ids: selectedStatement,
    })).then((res) => {
      if (res.error) {
        message.error("Failed to add statements");
      } else {
        message.success("Statements added successfully");
        setSelectedStatement([]);
        onClose();
      }
    });
  };

  const isSubmissionDisabled = () => {
    if (!selectedStatement.length || !selectedEgogramName || loading) return true;
    if (selectedCategories.size === 0) return true;
    
    const categoryCounts = {};
    selectedStatement.forEach(id => {
      const stmt = statements.find(s => s.id === id);
      if (stmt?.category) {
        categoryCounts[stmt.category] = (categoryCounts[stmt.category] || 0) + 1;
      }
    });

    const counts = Object.values(categoryCounts);
    return !(counts.length > 0 && counts.every(val => val === counts[0]));
  };

  const selectedTest = tests?.find((test) => test?.id === selectedEgogramName);

  // Tooltip content based on what's missing
  const getTooltipContent = () => {
    if (!selectedEgogramName) return "Please select an egogram name";
    if (!selectedStatement.length) return "Please select at least one statement";
    if (statementsPerCategory === null) return "All categories must have the same number of statements";
    return "";
  };

    const handleNewNameAdded = (newNameId) => {
    setSelectedEgogramName(newNameId);
    // Refresh both tests and statements
    dispatch(fetchAllEgogramTests()).then(() => {
      dispatch(fetchAllEgogramStatements());
    });
  };

 const handleNewCategoryAdded = () => {
  dispatch(fetchAllEgogramCategories()).then((res) => {
    if (res.payload?.categories) {
      setCategories(res.payload.categories); // ✅ Update local state
    }
  });
  dispatch(fetchAllEgogramStatements());
};


  return (
    <>
      <Modal
        width={600}
        title="Add Egogram Test"
        visible={open}
        onCancel={onClose}
        footer={[
          <Button key="back" onClick={onClose}>Cancel</Button>,
          <Tooltip 
  title={isSubmissionDisabled() ? getTooltipContent() : null} 
  placement="top"
>
  <span>
    <Button
      key="submit"
      type="primary"
      danger
      onClick={handleAddStatementToTest}
      disabled={isSubmissionDisabled()}
    >
      {loading ? <Spin size="small" /> : "Add Statement to Test"}
    </Button>
  </span>
</Tooltip>

        ]}
      >
        {/* Rest of your original modal content remains exactly the same */}
        <Title level={5}>Add Egogram Name</Title>
        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Button 
              onClick={() => setNewModalOpen(true)} 
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
                onChange={setSelectedEgogramName}
                value={selectedEgogramName}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                disabled={loading}
              >
                {tests?.map(test => test?.test_name && (
                  <Option key={test.id} value={test.id}>{test.test_name}</Option>
                ))}
              </Select>
            </Space>
          </Col>
        </Row>

        {selectedEgogramName && (
          <div style={{ marginBottom: 24 }}>
            <strong>Selected Egogram:</strong> {selectedTest?.test_name}
          </div>
        )}

        <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
  <Col>
    <Title level={5} style={{ margin: 0 }}>Add Statement</Title>
  </Col>
  <Col>
    <Button
      onClick={() => setStatementModalOpen(true)}
      type="dashed"
      style={{ color: "#52c41a", borderColor: "#52c41a", marginRight: 80  }}
      disabled={loading}
    >
      Add New Statement
    </Button>
  </Col>
</Row>

<Row gutter={16} align="middle">
  <Col>
    <Space>
      <span>Existing Statements</span>
      <Select
        mode="multiple"
        placeholder="Select Statement"
        style={{ width: 350 }}
        onChange={handleStatementSelection}
        value={selectedStatement}
        showSearch
        filterOption={(input, option) =>
          option.children.props.children[0].toLowerCase().includes(input.toLowerCase())
        }
        optionLabelProp="truncatedLabel"
        disabled={loading}
        maxTagCount="responsive"
        tagRender={(props) => (
          <Tag closable={props.closable} onClose={props.onClose} style={{ marginRight: 4 }}>
            {props.label.length > 3 ? `${props.label.substring(0, 3)}...` : props.label}
          </Tag>
        )}
      >
        {filteredStatements.map(statement => statement?.statement && (
          <Option key={statement.id} value={statement.id} label={statement.statement}
            truncatedLabel={statement.statement.length > 3 ? `${statement.statement.substring(0, 3)}...` : statement.statement}>
            <div>
              {statement.statement}
              <span style={{ color: "#bfbfbf", marginLeft: "8px" }}>
                ({getCategoryName(statement.category)})
              </span>
            </div>
          </Option>
        ))}
      </Select>
    </Space>
  </Col>
</Row>

        <div style={{ marginTop: 8 }}>
          <Text type="secondary">
            Categories: {selectedCategories.size} | 
            Total Statements: {selectedStatement.length}
            {statementsPerCategory !== null && (
              <span> | {statementsPerCategory} per category</span>
            )}
          </Text>
          {selectedCategories.size > 0 && (
            <div style={{ marginTop: 4 }}>
              {Array.from(selectedCategories).map(catId => {
                const cat = categories.find(c => c.id === catId);
                const count = selectedStatement.filter(id => 
                  statements.find(s => s.id === id)?.category === catId
                ).length;
                return cat && (
                  <Tag 
                    color={statementsPerCategory !== null && count === statementsPerCategory ? "green" : "blue"} 
                    key={catId}
                  >
                    {cat.category} ({count})
                  </Tag>
                );
              })}
            </div>
          )}
        </div>

        {selectedStatement.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <strong>Selected Statements:</strong>
            <ul>
              {selectedStatement.map((id, index) => {
                const statement = statements.find((s) => s.id === id);
                return statement && (
                  <li key={index}>
                    {statement.statement}
                    <span style={{ color: "#bfbfbf", marginLeft: "8px" }}>
                      ({getCategoryName(statement.category)})
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
        onNewNameAdded={handleNewNameAdded}
      />
      <AddEgoStateModal
        open={statementModalOpen}
        onClose={() => {
          setStatementModalOpen(false);
          dispatch(fetchAllEgogramStatements());
        }}
      />
      <AddEgoCatModal 
      open={categoryModalOpen}
  onClose={() => setCategoryModalOpen(false)}
  onNewCategoryAdded={handleNewCategoryAdded}
  />
    </>
  );
};

export default AddEgoQuesModal;