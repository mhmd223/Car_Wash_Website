import { useEffect } from "react";

export default function useSocket(socket, eventName, callBack) {
  useEffect(() => {
    if (!socket) return;

    socket.on(eventName, callBack);

    return () => {
      socket.off(eventName, callBack);
    };
  }, []);
}
