import React, { useState, useEffect } from "react";
import useWebRTC from "./hooks/useWebRTC";
import { FiMessageCircle, FiX, FiMic, FiMicOff } from "react-icons/fi";
import "./VoiceBot.css";

export default function VoiceBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [sending, setSending] = useState(false);

  const {
    connect,
    disconnect,
    sendText,
    sendVoice,
    toggleMute,
    isConnected,
    connectionState,
    iceState,
    remoteAudioRef,
  } = useWebRTC((botText) => {
    setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
  });

  useEffect(() => {
    if (isOpen && connectionState === "disconnected") {
      connect();
    }
    if (!isOpen && connectionState !== "disconnected") {
      disconnect();
    }
  }, [isOpen]);

  const handleSendText = (text) => {
    if (!text) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    sendText(text);
  };

  const handleSendVoice = async () => {
    if (!isConnected) {
      alert("Please wait for connection to complete");
      return;
    }
    setSending(true);
    await sendVoice(1200);
    setMessages((prev) => [...prev, { sender: "user", text: "(voice sent)" }]);
    setSending(false);
  };

  return (
    <>
      {!isOpen && (
        <div className="voicebot-toggle-wrapper">
          <button className="voicebot-toggle" onClick={() => setIsOpen(true)}>
            <FiMessageCircle size={22} />
          </button>
        </div>
      )}

      {isOpen && (
        <div className="voicebot-window">
          <div className="voicebot-header">
            <div>Voice Bot</div>
            <div>
              <button
                onClick={() => {
                  toggleMute();
                  setIsMuted((s) => !s);
                }}
                title={isMuted ? "Unmute mic" : "Mute mic"}
                style={{ marginRight: 8 }}
              >
                {isMuted ? <FiMicOff /> : <FiMic />}
              </button>
              <button onClick={() => setIsOpen(false)}>
                <FiX />
              </button>
            </div>
          </div>

          <div className="voicebot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`voicebot-message ${m.sender}`}>
                {m.text}
              </div>
            ))}
            {connectionState === "failed" && (
              <div className="voicebot-message system">
                Connection failed. Please try again.
              </div>
            )}
          </div>

          <div className="voicebot-controls">
            <button 
              onClick={() => handleSendText("hello")} 
              disabled={!isConnected}
            >
              Send "hello"
            </button>
            <button 
              onClick={handleSendVoice} 
              disabled={!isConnected || sending}
            >
              {sending ? "Recording..." : "Send Voice"}
            </button>
            <div className="connection-status">
              Status: {connectionState}
              {iceState && ` (${iceState})`}
            </div>
          </div>

          <audio ref={remoteAudioRef} autoPlay playsInline />
        </div>
      )}
    </>
  );
}