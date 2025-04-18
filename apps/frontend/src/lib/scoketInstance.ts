//scoket instance for real time updates

import { io } from "socket.io-client";


export const socket = io(process.env.BASE_URL as string || "http://localhost:5000",{
    transports: ['websocket'],
    withCredentials: true,
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
