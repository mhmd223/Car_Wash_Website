import { io } from "socket.io-client";

const URL = "http://localhost:5173";
const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
