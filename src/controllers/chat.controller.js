import asyncHandler from '../utils/asyncHandler.js';
import Chat from '../models/chat.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const accessChat = asyncHandler(async (req, res) => {
    //   Chat access logic here
    const {userId} = req.body;
    if (!userId) {
        res.status(400);
        throw new Error("UserId param not sent with request");
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password -refreshToken -__v")
        .populate("latestMessage");
    isChat = await Chat.populate(isChat, {
        path: "latestMessage.sender",
        select: "username email profileImage",
    });
    if (isChat.length > 0) {
        res.status(200).json(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password -refreshToken -__v");
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }

});

const fetchChat = asyncHandler(async (req, res) => {
    //   Fetch chat logic here
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password -refreshToken -__v")
        .populate("groupAdmin", "-password -refreshToken -__v")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await Chat.populate(results, {
                path: "latestMessage.sender",
                select: "username email profileImage",
            });
            res.status(200).json(results);
        });
                    
    } catch (error) {
        
    }
    
});

const createGroupChat = asyncHandler(async (req, res) => {
    //   Create group chat logic here
    const { users, name } = req.body;
    if (!users || !name) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }   

    var usersArray = JSON.parse(users);
    if (usersArray.length < 2) {
        res.status(400);
        throw new Error("More than 2 users are required to form a group chat");
    }
    usersArray.push(req.user); // adding the logged in user to the group
    try {
        const groupChat = await Chat.create({
            chatName: name,
            users: usersArray,
            isGroupChat: true,
            groupAdmin: req.user
        });
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password -refreshToken -__v").populate("groupAdmin", "-password -refreshToken -__v");
        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const renameGroup = asyncHandler(async (req, res) => {
    //   Rename group logic here
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
        .populate("users", "-password -refreshToken -__v")
        .populate("groupAdmin", "-password -refreshToken -__v");
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.status(200).json(updatedChat);
    }
});

const removeFromGroup = asyncHandler(async (req, res) => {
    //   Remove from group logic here
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
        .populate("users", "-password -refreshToken -__v")
        .populate("groupAdmin", "-password -refreshToken -__v");
    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.status(200).json(removed);
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    //   Add to group logic here
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
        .populate("users", "-password -refreshToken -__v")
        .populate("groupAdmin", "-password -refreshToken -__v");
    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.status(200).json(added);
    }
});

const groupMembers = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId).populate("users", "-password -refreshToken -__v").populate("groupAdmin", "-password -refreshToken -__v");
    if (!chat) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        res.status(200).json(chat.users);
    }
});

export { accessChat, fetchChat, createGroupChat, renameGroup, removeFromGroup, addToGroup, groupMembers };