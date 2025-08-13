import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Spin, message as AntMessage } from "antd";
import { MessageOutlined, CloseOutlined, SendOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { runChatBot, resetChatBotState } from "../Redux/Slices/AIintegrationSlice";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector(state => state.aiintegration.chatBot);

  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setOpen(!open);
    if (!open) {
      dispatch(resetChatBotState());
      setMessages([]);
      setInput("");
    }
  };

  const sendMessage = () => {
    if (input.trim() === "") return;

    // Add user message
    const userMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);

    // Dispatch thunk to send message to API
    dispatch(runChatBot(input));

    setInput("");
  };

  // When API data arrives, add chatbot response message
  useEffect(() => {
    if (data) {
      // Assume your API returns response in `data.reply` or similar; adjust accordingly
      const botResponseText = data.response || JSON.stringify(data);
      const botMsg = { id: Date.now() + 1, text: botResponseText, sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
    }
  }, [data]);

  // Show error message from API
  useEffect(() => {
    if (error) {
      AntMessage.error(error);
    }
  }, [error]);

  // Scroll to bottom of messages on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "280px",
            height: "350px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1500,
          }}
        >
          <div
            style={{
              backgroundColor: "#1890ff",
              color: "white",
              padding: "10px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Chat with Us
            <Button
              type="text"
              onClick={toggleChat}
              icon={<CloseOutlined style={{ color: "white", fontSize: "20px" }} />}
            />
          </div>

          <div
            style={{
              flexGrow: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#e6f7ff",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  backgroundColor: msg.sender === "user" ? "#91d5ff" : "#bae7ff",
                  padding: "8px 12px",
                  borderRadius: "15px",
                  marginBottom: "8px",
                  maxWidth: "90%",
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ marginBottom: 8 }}>
                <Spin size="small" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #ccc",
              display: "flex",
              gap: "8px",
            }}
          >
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={sendMessage}
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              disabled={loading}
            />
          </div>
        </div>
      )}

      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<MessageOutlined style={{ fontSize: "30px" }} />}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "30px",
          zIndex: 1500,
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        }}
        onClick={toggleChat}
        aria-label="Open chatbot"
      />
    </>
  );
};

export default ChatBot;
