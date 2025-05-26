import React, { useState, useEffect } from "react";
import { Modal, Input, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addEgogramCategory } from "../Redux/Slices/egoSlice";

const { Title } = Typography;

const AddEgoCatModal = ({ open, onClose, onNewCategoryAdded }) => {
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");

  const { success, error } = useSelector((state) => state.ego);

  useEffect(() => {
    if (open) {
      setCategoryName("");
      setCategoryDesc("");
    }
  }, [open]);

  useEffect(() => {
    if (success) {
      message.success(success);
      onNewCategoryAdded?.({
        category: categoryName.trim(),
        category_description: categoryDesc.trim(),
      });
      handleCancel(); // Reset and close
    }
    if (error) {
      message.error(error);
    }
  }, [success, error]);

  const handleOk = async () => {
    if (!categoryName.trim() || !categoryDesc.trim()) {
      message.warning("Please fill in all fields.");
      return;
    }

    const categoryPayload = {
      category: categoryName.trim(),
      category_description: categoryDesc.trim(),
    };

    await dispatch(addEgogramCategory(categoryPayload));
  };

  const handleCancel = () => {
    setCategoryName("");
    setCategoryDesc("");
    onClose();
  };

  return (
    <Modal
      title="Add New Category"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Add Category"
      className="ego-category-modal"
      okButtonProps={{
        disabled: !categoryName.trim() || !categoryDesc.trim(),
      }}
    >
      <Title level={5}>Category Name</Title>
      <Input
        placeholder="Enter category name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="category-input"
      />

      <Title level={5} style={{ marginTop: 16 }}>
        Category Description
      </Title>
      <Input
        placeholder="Enter category description"
        value={categoryDesc}
        onChange={(e) => setCategoryDesc(e.target.value)}
        className="category-input"
      />
    </Modal>
  );
};

export default AddEgoCatModal;
