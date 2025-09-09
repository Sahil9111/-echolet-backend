import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from './db/index.js';
import app from "./app.js";

dotenv.config({ path: '.env', quiet: true });

// Connect to DB
connectDB().then(() => {
  const server = http.createServer(app);
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected to Socket.IO:", socket.id);

    // Setup user
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
      console.log(`User setup complete: ${userData._id}`);
    });

    // Join chat room
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log(`User joined chat room: ${room}`);
    });

    // Handle new message
    socket.on("new message", (newMessageReceived) => {
      const chat = newMessageReceived.chat;
      if (!chat?.users) {
        console.log("Chat users not defined!");
        return;
      }

      // Send to all users except the sender
      chat.users.forEach((user) => {
        if (user._id !== newMessageReceived.sender._id) {
          socket.to(user._id).emit("messageReceived", newMessageReceived);
        }
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((error) => {
  console.error("Database connection error:", error);
});
