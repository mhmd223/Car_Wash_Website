import { useEffect } from "react";

export default function useSocket(socket, eventName, callBack) {
  if (!socket) {
    console.error("Socket is not initialized.");
    return;
  }

  useEffect(() => {
    socket.on(eventName, callBack);

    return () => {
      socket.off(eventName, callBack);
    };
  }, []);
}
