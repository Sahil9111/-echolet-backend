import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config({quiet: true});


const verifyUser = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer " ,"");
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findById(decoded.id).select("-password -refreshToken -__v"); 
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
});

export { verifyUser };