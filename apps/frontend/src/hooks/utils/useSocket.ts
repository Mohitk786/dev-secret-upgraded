import { useEffect, useRef } from "react";
import { socketInstance } from "@/lib/scoketInstance"; 

import { Socket } from "socket.io-client";

let sharedSocket: Socket | null = null;

const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  // Initialize only once
  if (!sharedSocket) {
    socketInstance.connect(); 
    sharedSocket = socketInstance.socket;
  }

  socketRef.current = sharedSocket;

  useEffect(() => {
    
    if (!sharedSocket?.connected) {
      socketInstance.connect();
    }

    return () => {
      // ⚠️ We don’t disconnect here to prevent breaking shared usage.
      // If you want auto-disconnect when no one uses it, that logic can be added separately.
    };
  }, []);

  return socketRef.current!;
};

export default useSocket;
