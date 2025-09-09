import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/db/index.js";
import app from "./src/app.js";

dotenv.config();

// DB connect
connectDB();

// Create HTTP server
const server = http.createServer(app);

// WebSocket setup
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",  // frontend address,
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat room: ${chatId}`);
    });

    socket.on("newMessage", (message) => {
        const chat = message.chat;
        if (!chat?.users) return;

        chat.users.forEach((user) => {
            if (user._id !== message.sender._id) {
                socket.to(chat._id).emit("messageReceived", message);
            }
        });
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);
