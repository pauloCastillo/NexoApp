import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import type { Server as HttpsServer } from 'https';

dotenv.config();

let io: SocketIOServer;

const setupSocketIO = (server: HttpsServer): SocketIOServer => {
    io = new SocketIOServer(server, {
        cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        },
    });

    io.of('/api/dashboard');

    return io;
}

function getIO(): SocketIOServer {
    if (!io) throw new Error('Socket.IO not initialized');
    return io;
}

export { getIO };
export default setupSocketIO;