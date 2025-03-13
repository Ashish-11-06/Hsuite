import React, { useEffect } from "react";
import { Modal, List, Spin, Alert } from "antd";

const HistoryModal = ({ open, onClose, history }) => {
  useEffect(() => {
      //console.log("🔵 Rendering HistoryModal with data:", history);
  }, [history]);

  return (
      <Modal title="History" open={open} onCancel={onClose} footer={null}>
          {history.length === 0 ? (
              <Alert message="No history available" type="info" showIcon />
          ) : (
              <List
                  bordered
                  dataSource={history}
                  renderItem={(item) => (
                      <List.Item>
                          <div>
                              <strong>{item.changes.code || "No Code"}</strong>
                              <p>{item.changes.sub_description || "No Description"}</p>
                              <p>Updated by: {item.updated_by}</p>
                              <p>Updated at: {new Date(item.updated_at).toLocaleString()}</p>
                          </div>
                      </List.Item>
                  )}
              />
          )}
      </Modal>
  );
};
export default HistoryModal;