import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Typography,
  Select,
  Button,
  Row,
  Col,
  Space,
  Form,
  message,
  Tag
} from "antd";
import { useDispatch } from "react-redux";
import {
  addEgogramCategory,
  addEgogramStatement,
  fetchAllEgogramCategories
} from "../Redux/Slices/egoSlice";
import AddEgoCatModal from './AddEgoCatModal';

const { Title, Text } = Typography;
const { Option } = Select;

const AddEgoStateModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [existingCategories, setExistingCategories] = useState([]);
  const [statements, setStatements] = useState([
    {
      statement: "",
      selectedCategory: "",
      categoryType: null,
      id: Date.now(),
      showCategoryOptions: false
    }
  ]);
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usedCategories, setUsedCategories] = useState(new Set());

  useEffect(() => {
    if (open) {
      setStatements([{
        statement: "",
        selectedCategory: "",
        categoryType: null,
        id: Date.now(),
        showCategoryOptions: false
      }]);
      setSubmitAttempted(false);

      dispatch(fetchAllEgogramCategories()).then((res) => {
        if (res.payload && res.payload.categories) {
          setExistingCategories(res.payload.categories);
        }
      });
    }
  }, [open, dispatch]);

  useEffect(() => {
    const categoriesInUse = new Set();
    statements.forEach(statement => {
      if (statement.selectedCategory) {
        categoriesInUse.add(statement.selectedCategory);
      }
    });
    setUsedCategories(categoriesInUse);
  }, [statements]);

  const validateForm = () => {
    return !statements.some(statement => (
      !statement.statement.trim() ||
      (!statement.selectedCategory && statement.categoryType !== "new")
    ));
  };

  const handleAddStatement = () => {
    setStatements([
      ...statements,
      {
        statement: "",
        selectedCategory: "",
        categoryType: null,
        id: Date.now(),
        showCategoryOptions: false
      },
    ]);
  };

  const handleStatementChange = (id, value) => {
    setStatements(statements.map(stat =>
      stat.id === id ? { ...stat, statement: value } : stat
    ));
  };

  const handleCategoryChange = (id, value, categoryObj) => {
    const newCategories = new Set(usedCategories);
    const currentStatement = statements.find(s => s.id === id);
    
    if (currentStatement?.selectedCategory) {
      newCategories.delete(currentStatement.selectedCategory);
    }
    
    if (value && !newCategories.has(value)) {
      if (newCategories.size >= 4) {
        message.warning('Maximum of 4 different categories allowed');
        return;
      }
      newCategories.add(value);
    }
    
    setStatements(statements.map(stat =>
      stat.id === id ? {
        ...stat,
        selectedCategory: value,
        categoryType: "existing",
        categoryName: categoryObj?.category
      } : stat
    ));
  };

  const toggleCategoryOptions = (id) => {
    setStatements(statements.map(stat =>
      stat.id === id ? { ...stat, showCategoryOptions: !stat.showCategoryOptions } : stat
    ));
  };

  const handleNewCategoryClick = (id) => {
    setStatements(statements.map(stat =>
      stat.id === id ? { ...stat, categoryType: "new" } : stat
    ));
    setIsAddCatModalOpen(true);
  };

  const handleOk = async () => {
    setSubmitAttempted(true);
    setLoading(true);

    if (!validateForm()) {
      message.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const allStatementsPayload = [];

    try {
      for (let i = 0; i < statements.length; i++) {
        const { statement, selectedCategory, categoryType } = statements[i];
        let finalCategoryId = "";

        if (!statement.trim()) continue;

        if (categoryType === "new") {
          setLoading(false);
          return;
        } else if (categoryType === "existing") {
          finalCategoryId = selectedCategory;
        }

        allStatementsPayload.push({
          statement: statement,
          category: finalCategoryId,
          test: 1,
        });
      }

      if (allStatementsPayload.length > 0) {
        const result = await dispatch(addEgogramStatement(allStatementsPayload));
        if (result.payload) {
          onClose();
        }
      }
    } catch (error) {
      message.error('An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  const showValidationFeedback = (fieldValue) => {
    return submitAttempted && !fieldValue;
  };

  return (
    <>
      <Modal
        title="Add Statement"
        visible={open}
        onCancel={onClose}
        onOk={handleOk}
        okText="Add"
        width={600}
        confirmLoading={loading}
      >
        <Title level={5}>Statements</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Maximum 4 different categories allowed. Current: {usedCategories.size}/4
        </Text>
        {usedCategories.size > 0 && (
          <div style={{ marginBottom: 16 }}>
            {Array.from(usedCategories).map(catId => {
              const cat = existingCategories.find(c => c.id === catId);
              return cat ? (
                <Tag color="blue" key={catId} style={{ marginBottom: 4 }}>
                  {cat.category}
                </Tag>
              ) : null;
            })}
          </div>
        )}

        {statements.map((stat) => (
          <div key={stat.id} style={{ marginBottom: 16 }}>
            <Form.Item
              validateStatus={showValidationFeedback(stat.statement.trim()) ? "error" : ""}
              help={showValidationFeedback(stat.statement.trim()) ? "Statement is required" : ""}
            >
              <Row gutter={16} align="middle" style={{ marginBottom: 8 }}>
                <Col flex="auto">
                  <Input
                    placeholder="Enter statement"
                    value={stat.statement}
                    onChange={e => handleStatementChange(stat.id, e.target.value)}
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    onClick={() => toggleCategoryOptions(stat.id)}
                    disabled={loading}
                  >
                    Add Category
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            {stat.showCategoryOptions && (
              <div style={{ marginTop: 8, marginBottom: 16 }}>
                <Form.Item
                  validateStatus={
                    showValidationFeedback(stat.selectedCategory || stat.categoryType === "new") ? "error" : ""
                  }
                  help={
                    showValidationFeedback(stat.selectedCategory || stat.categoryType === "new")
                      ? "Category is required"
                      : ""
                  }
                >
                  <Row gutter={16} align="middle">
                    <Col>
                      <Button
                        type="primary"
                        danger
                        onClick={() => handleNewCategoryClick(stat.id)}
                        disabled={loading || usedCategories.size >= 4}
                      >
                        New Category
                      </Button>
                    </Col>
                    <Col>
                      <Space>
                        <span>Existing Category</span>
                        <Select
                          placeholder="Select Category"
                          style={{ width: 300 }}
                          value={stat.selectedCategory}
                          onChange={(value) => {
                            const selectedCat = existingCategories.find(cat => cat.id === value);
                            handleCategoryChange(stat.id, value, selectedCat);
                          }}
                          disabled={loading}
                        >
                          {existingCategories.map((cat) => {
                            const isDisabled = !usedCategories.has(cat.id) && usedCategories.size >= 4;
                            return (
                              <Option 
                                key={cat.id} 
                                value={cat.id}
                                disabled={isDisabled}
                              >
                                {cat.category}
                                {isDisabled && " (limit reached)"}
                              </Option>
                            );
                          })}
                        </Select>
                      </Space>
                    </Col>
                  </Row>
                </Form.Item>
              </div>
            )}

            {stat.categoryType === "existing" && stat.selectedCategory && (
              <div style={{ marginTop: 8 }}>
                <span>Selected Category: </span>
                <strong>
                  {existingCategories.find(c => c.id === stat.selectedCategory)?.category ||
                    stat.categoryName}
                </strong>
              </div>
            )}
          </div>
        ))}

        <Button
          type="dashed"
          onClick={handleAddStatement}
          style={{ marginTop: 16, width: "100%" }}
          disabled={loading}
        >
          Add Another Statement
        </Button>
      </Modal>

      <AddEgoCatModal
        open={isAddCatModalOpen}
        onClose={() => {
          setIsAddCatModalOpen(false);
          dispatch(fetchAllEgogramCategories()).then((res) => {
            if (res.payload && res.payload.categories) {
              setExistingCategories(res.payload.categories);
            }
          });
        }}
        onNewCategoryAdded={() => {
          // No auto-select behavior
        }}
      />
    </>
  );
};

export default AddEgoStateModal;