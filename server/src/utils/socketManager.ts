import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import type { Server as HttpsServer } from 'https';

dotenv.config();

let io: SocketIOServer;

const setupSocketIO = (server: HttpsServer): SocketIOServer => {
    const allowedOrigins = process.env.CLIENT_URL?.split(",").map((s) => s.trim()).filter(Boolean);
    io = new SocketIOServer(server, {
        cors: {
        origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : [],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: !!(allowedOrigins && allowedOrigins.length > 0),
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