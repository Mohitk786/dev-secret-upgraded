import { io } from "socket.io-client";

export const socket = io("ws://localhost:8000", {
  transports: ['websocket'],
  withCredentials: true,
  reconnection: true,  // Enables auto-reconnection on disconnect
  reconnectionAttempts: 5,  // Number of reconnection attempts before giving up
  reconnectionDelay: 1000,  // Delay before attempting to reconnect
  reconnectionDelayMax: 5000,  // Maximum delay between reconnection attempts
});


export const socketInstance = {
  socket,
  connect: () => {
    socket.connect();   
  },
  disconnect: () => {
    socket.disconnect();
  },
  on: (event: string, callback: (data: any) => void) => {
    socket.on(event, callback);
  },
  off: (event: string, callback: (data: any) => void) => {
    socket.off(event, callback);
  },
  emit: (event: string, data: any) => {
    socket.emit(event, data);
  }
};
