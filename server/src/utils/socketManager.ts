import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import type { Server as HttpsServer } from 'https';

dotenv.config();

const setupSocketIO = (server: HttpsServer): SocketIOServer => {
    const io = new SocketIOServer(server, {
        cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        },
    });

    return io;
}

export default setupSocketIO;