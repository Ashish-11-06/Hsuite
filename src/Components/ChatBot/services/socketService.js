// services/socketService.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SIGNALING_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;
