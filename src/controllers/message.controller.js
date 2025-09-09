import asyncHandler from '../utils/asyncHandler.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import Chat from '../models/chat.model.js';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { content, chatId } = req.body;
        const userId = req.user._id;
        if (!content || !chatId) {
            res.status(400);
            throw new Error("Content and Chat ID are required");
        }
        const message = await Message.create({ sender: userId, content, chat: chatId });
        if (!message) {
            res.status(500);
            throw new Error("Failed to send message");
        }
        await message.populate('sender', 'username profileImage');
        await message.populate('chat');
        await User.populate(message, { path: 'chat.users', select: 'username profileImage email' });
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
        res.status(201).json({ message });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

const getMessages = asyncHandler(async (req, res) => {
    try {
        const { chatId } = req.params;
        if (!chatId) {
            res.status(400);
            throw new Error("Chat ID is required");
        }
        const messages = await Message.find({ chat: chatId })
            .populate('sender', 'username profileImage email')
            .populate('chat');
        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

export { sendMessage, getMessages };