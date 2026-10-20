import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_API;
const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"],
});
socket.on("connect", () => console.log("Socket connected"));
socket.on("hello", (m) => console.log(m));
socket.on("connect_error", (e) => {
  console.log("Socket connection error:", e.stack);
  console.log("Socket connection error message:", e.message);
  console.log("Socket connection error name:", e.name);
  console.log("Socket connection error stack trace:", e.stack);
});

export default socket;
