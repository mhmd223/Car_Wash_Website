import { Server } from "socket.io";

export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      autoConnect: false,
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.join("user" + socket.handshake.auth.userId);

    if (socket.handshake.auth.role === "washer") {
      socket.join("washer");
      console.log("User joined washer room:", socket.id);
    }

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return io;
}
