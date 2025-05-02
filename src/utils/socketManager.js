const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();

const setupSocketIO = (server) => {
    const io = new Server(server, {
        cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        },
    });
    
    return io;  
}

module.exports = setupSocketIO;