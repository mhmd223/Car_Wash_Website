import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL;
const socket = io("https://car-wash-website-server-chi.vercel.app", {
  autoConnect: false,
  withCredentials: true,
  path: "/api/socket-io/socket.io",
  transports: ["websocket", "polling"],
});
socket.on("connect", () => console.log("test connected"));
socket.on("hello", (m) => console.log(m));
socket.on("connect_error", (e) => {
  console.log("test error:", e.stack);
  console.log("test error message:", e.message);
  console.log("test error name:", e.name);
  console.log("test error stack trace:", e.stack);
});

export default socket;
