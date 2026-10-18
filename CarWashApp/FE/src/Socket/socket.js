import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL;
const socket = io("https://car-wash-website-server-chi.vercel.app", {
  autoConnect: false,
  withCredentials: true,
  path: "/api/socket-io/socket.io",
  transports: ["websocket"],
});

export default socket;
