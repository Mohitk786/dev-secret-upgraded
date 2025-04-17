import { io, userSocketMap } from "../index";


export const getSocketByUserId = (userId: string) => {
    const socketId = userSocketMap.get(userId);
    return socketId ? io.sockets.sockets.get(socketId) : null;
}