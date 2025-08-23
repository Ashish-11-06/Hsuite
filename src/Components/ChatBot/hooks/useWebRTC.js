import { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

export default function useWebRTC(onBotMessage) {
  const [connectionState, setConnectionState] = useState("disconnected"); // 'disconnected'|'connecting'|'connected'|'failed'
  const [iceState, setIceState] = useState(""); // Track ICE gathering state
  const remoteAudioRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const dataChannelRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingSends = useRef([]);
  const mediaRecorderRef = useRef(null);
  const connectTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      } catch (e) {}
      clearTimeout(connectTimeoutRef.current);
      disconnect();
    };
  }, []);

  const connect = async (signalingUrl = "http://localhost:8080") => {
    console.log("[useWebRTC] connecting to", signalingUrl);
    setConnectionState("connecting");
    
    // Clear any existing timeout
    clearTimeout(connectTimeoutRef.current);
    
    // Set new timeout (15 seconds)
    connectTimeoutRef.current = setTimeout(() => {
      if (connectionState !== "connected") {
        console.error("[useWebRTC] Connection timeout");
        setConnectionState("failed");
        disconnect();
      }
    }, 15000);

    socketRef.current = io(signalingUrl, { 
      transports: ["websocket"],
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", async () => {
      console.log("[useWebRTC] socket connected -> start webrtc");
      await startWebRTC();
    });

    socketRef.current.on("answer", async (answer) => {
      console.log("[useWebRTC] got answer");
      if (!pcRef.current) return;
      try {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("[useWebRTC] setRemoteDescription(answer) done");
      } catch (err) {
        console.error("[useWebRTC] setRemoteDescription(answer) error:", err);
        setConnectionState("failed");
      }
    });

    socketRef.current.on("ice-candidate", async (data) => {
      console.log("[useWebRTC] incoming ice-candidate", data);
      if (!pcRef.current) return;
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate ? data.candidate : data));
        console.log("[useWebRTC] added remote ICE candidate");
      } catch (err) {
        console.error("[useWebRTC] addIceCandidate error:", err);
      }
    });

    socketRef.current.on("server_message", (m) => {
      console.log("[useWebRTC] server_message:", m);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("[useWebRTC] socket connect_error:", err);
      setConnectionState("failed");
      clearTimeout(connectTimeoutRef.current);
    });
  };

  const startWebRTC = async () => {
    console.log("[useWebRTC] startWebRTC");
    try {
      pcRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" }
        ],
      });

      // Connection state tracking
      pcRef.current.onconnectionstatechange = () => {
        console.log("[useWebRTC] connection state:", pcRef.current.connectionState);
        if (pcRef.current.connectionState === "connected") {
          setConnectionState("connected");
          clearTimeout(connectTimeoutRef.current);
        } else if (pcRef.current.connectionState === "failed") {
          setConnectionState("failed");
        }
      };

      pcRef.current.onsignalingstatechange = () => {
        console.log("[useWebRTC] signaling state:", pcRef.current.signalingState);
      };

      pcRef.current.oniceconnectionstatechange = () => {
        console.log("[useWebRTC] ICE connection state:", pcRef.current.iceConnectionState);
      };

      // Remote audio track playback
      pcRef.current.ontrack = (event) => {
        console.log("[useWebRTC] ontrack", event.streams);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
          console.log("[useWebRTC] attached remote stream to audio element");
        }
      };

      pcRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          setIceState("gathering");
          console.log("[useWebRTC] sending local ICE candidate");
          socketRef.current.emit("ice-candidate", { 
            candidate: event.candidate.candidate, 
            sdpMid: event.candidate.sdpMid, 
            sdpMLineIndex: event.candidate.sdpMLineIndex 
          });
        } else {
          setIceState("complete");
          console.log("[useWebRTC] local ICE gathering complete (null candidate)");
        }
      };

      // Create reliable data channel with negotiation
      dataChannelRef.current = pcRef.current.createDataChannel("chat", {
        negotiated: true,
        id: 0,
        ordered: true,
      });

      dataChannelRef.current.onopen = () => {
        console.log("[useWebRTC] data channel open");
        setIsConnected(true);
        // Flush queued messages
        while (pendingSends.current.length > 0) {
          const m = pendingSends.current.shift();
          _sendOverDataChannel(m);
        }
      };

      dataChannelRef.current.onclose = () => {
        console.log("[useWebRTC] data channel closed");
        setConnectionState("disconnected");
      };

      dataChannelRef.current.onerror = (e) => {
        console.error("[useWebRTC] data channel error", e);
        setConnectionState("failed");
      };

      dataChannelRef.current.onmessage = (evt) => {
        try {
          const parsed = JSON.parse(evt.data);
          console.log("[useWebRTC] data channel message IN:", parsed);

          if (parsed.bottext) {
            onBotMessage?.(parsed.bottext);
          }
          if (parsed.botvoice) {
            playBase64Audio(parsed.botvoice);
          }
        } catch (err) {
          console.warn("[useWebRTC] data channel non-json message:", evt.data);
          onBotMessage?.(evt.data);
        }
      };

      // Get microphone
      try {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current.getTracks().forEach((track) => {
          pcRef.current.addTrack(track, localStreamRef.current);
        });
        console.log("[useWebRTC] local microphone tracks added to PC");
      } catch (err) {
        console.error("[useWebRTC] getUserMedia failed:", err);
        setConnectionState("failed");
        return;
      }

      // Setup MediaRecorder
      try {
        const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") 
          ? "audio/webm;codecs=opus" 
          : "audio/ogg;codecs=opus";
        mediaRecorderRef.current = new MediaRecorder(localStreamRef.current, { mimeType: mime });
        mediaRecorderRef.current.ondataavailable = async (e) => {
          if (!e.data || e.data.size === 0) return;
          const base64 = await blobToBase64(e.data);
          sendJSON({ voice: base64 });
          console.log("[useWebRTC] recorded snippet sent (base64 length):", base64.length);
        };
        console.log("[useWebRTC] MediaRecorder initialized with mime:", mediaRecorderRef.current.mimeType);
      } catch (err) {
        console.warn("[useWebRTC] MediaRecorder not available:", err);
      }

      // Create offer after negotiation needed
      pcRef.current.onnegotiationneeded = async () => {
        console.log("[useWebRTC] negotiationneeded -> creating offer");
        try {
          const offer = await pcRef.current.createOffer();
          await pcRef.current.setLocalDescription(offer);
          socketRef.current.emit("offer", { type: offer.type, sdp: offer.sdp }, (ack) => {
            if (!ack?.success) {
              console.error("[useWebRTC] Offer rejected by server");
              setConnectionState("failed");
            }
          });
          console.log("[useWebRTC] offer sent to server");
        } catch (err) {
          console.error("[useWebRTC] createOffer error:", err);
          setConnectionState("failed");
        }
      };
    } catch (err) {
      console.error("[useWebRTC] WebRTC initialization failed:", err);
      setConnectionState("failed");
      disconnect();
    }
  };


  // helper to convert blob -> base64 string (no prefix)
  const blobToBase64 = (blob) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result; // data:audio/webm;base64,XXXXX
        // strip prefix
        const comma = dataUrl.indexOf(",");
        res(dataUrl.slice(comma + 1));
      };
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(blob);
    });

  // helper to play base64 (without data: prefix)
  const playBase64Audio = (base64) => {
    try {
      const audio = new Audio("data:audio/webm;base64," + base64);
      audio.play().catch((e) => {
        // autoplay may require user gesture, attach to remoteAudioRef as fallback
        console.warn("[useWebRTC] audio.play() failed:", e);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.src = "data:audio/webm;base64," + base64;
          remoteAudioRef.current.play().catch((err) => console.error("[useWebRTC] fallback audio.play error:", err));
        }
      });
      console.log("[useWebRTC] playing base64 audio (length):", base64.length);
    } catch (e) {
      console.error("[useWebRTC] playBase64Audio error:", e);
    }
  };

  // internal: send JSON string over data channel, queue if not open
  const sendJSON = (obj) => {
    const str = JSON.stringify(obj);
    if (dataChannelRef.current && dataChannelRef.current.readyState === "open") {
      _sendOverDataChannel(str);
    } else {
      pendingSends.current.push(str);
      console.log("[useWebRTC] queued message (datachannel not open yet)");
    }
  };

  const _sendOverDataChannel = (str) => {
    try {
      dataChannelRef.current.send(str);
      console.log("[useWebRTC] sent over datachannel:", str.length, "chars");
    } catch (err) {
      console.error("[useWebRTC] send over datachannel failed:", err);
      // re-queue
      pendingSends.current.unshift(str);
    }
  };

  // Public: record a short snippet (durationMs) and send base64 with optional text
  const sendVoice = async (durationMs = 1200, text = "") => {
    if (!mediaRecorderRef.current) {
      console.warn("[useWebRTC] MediaRecorder not initialized - cannot send voice");
      return;
    }
    if (mediaRecorderRef.current.state === "recording") {
      console.warn("[useWebRTC] already recording");
      return;
    }
    // set up dataavailable will fire when stop() called
    const chunks = [];
    mediaRecorderRef.current.ondataavailable = async (e) => {
      if (e.data && e.data.size > 0) {
        try {
          const base64 = await blobToBase64(e.data);
          const payload = { text: text || "", voice: base64 };
          sendJSON(payload);
          console.log("[useWebRTC] sendVoice finished, sent payload len:", base64.length);
        } catch (err) {
          console.error("[useWebRTC] error converting blob to base64:", err);
        }
      }
      // restore handler to the default handler for future recordings
      mediaRecorderRef.current.ondataavailable = async (e2) => {
        if (e2.data && e2.data.size > 0) {
          const base64 = await blobToBase64(e2.data);
          sendJSON({ voice: base64 });
        }
      };
    };
    mediaRecorderRef.current.start();
    console.log("[useWebRTC] recording started for", durationMs, "ms");
    setTimeout(() => {
      try {
        mediaRecorderRef.current.stop();
        console.log("[useWebRTC] recording stopped");
      } catch (e) {
        console.warn("[useWebRTC] stop failed:", e);
      }
    }, durationMs);
  };


  
  // public simple send text-only (JSON { text })
  const sendText = (text) => {
    sendJSON({ text });
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        console.log(`[useWebRTC] mic ${track.enabled ? "unmuted" : "muted"}`);
      });
    }
  };

 const disconnect = () => {
    console.log("[useWebRTC] disconnecting");
    setConnectionState("disconnected");
    clearTimeout(connectTimeoutRef.current);
    
    try {
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {}
    
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    
    dataChannelRef.current = null;
    pendingSends.current = [];
  };

  return {
    connect,
    disconnect,
    sendText,
    sendVoice,
    toggleMute,
    isConnected: connectionState === "connected",
    connectionState, // Expose full state for UI
    iceState,       // Expose ICE state for debugging
    remoteAudioRef,
  };
}