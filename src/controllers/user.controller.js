import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({quiet: true});

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Failed to generate tokens");
    }
}


const registerUser = asyncHandler(async (req, res) => {

    //   Registration logic here
    const { username, email, password, bio } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(409);
        throw new Error("User already exists with this email");
    }

    const profileImage_path = req.file?.path

    if (!profileImage_path) {
        res.status(400);
        throw new Error("Profile image is required");
    }

    const profileImage = await uploadToCloudinary(profileImage_path);
    if (!profileImage) {
        res.status(500);
        throw new Error("Failed to upload profile image");
    }

    const user = await User.create({ username, email, password, profileImage: profileImage.url, bio });
    if (!user) {
        res.status(400);
        throw new Error("Failed to create user");
    } else {
        res.status(201).json({ message: "User registered successfully", user });
    }
})

const loginUser = asyncHandler(async (req, res) => {
    //   Login logic here
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error("Invalid email or password");
    } 

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
    // console.log(accessToken, refreshToken);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -__v");

    const options = {
        httpOnly: true,
        secure: true
    };
    return res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).json({ message: "User logged in successfully", user: loggedInUser, accessToken, refreshToken })   

});

const logoutUser = asyncHandler(async (req, res) => {
    //   Logout logic here
    const { refreshToken } = req.cookies;   
    if (!refreshToken) {
        res.status(400);
        throw new Error("No refresh token provided");
    }
    const user = await User.findOne({ _id: req.user.id});
    if (!user) {
        res.status(400);
        throw new Error("Invalid refresh token");
    }
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    const options = {
        httpOnly: true,
        secure: true,
        expires: new Date(0)
    };
    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);
    res.status(200).json({ message: "User logged out successfully" });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken  = req.cookies.refreshToken || req.body.refreshToken;
    if (!incommingRefreshToken) {
        res.status(400);
        throw new Error("No refresh token provided");
    }
    try {
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (!decodedToken || !decodedToken.id) {
            res.status(401);
            throw new Error("Invalid refresh token");
        }
        const user = await User.findById(decodedToken.id);
        if (!user || user.refreshToken !== incommingRefreshToken) {
            res.status(401);
            throw new Error("Invalid refresh token");
        }
       const options = {
            httpOnly: true,
            secure: true
        };
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        return res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).json({ message: "Access token refreshed successfully", accessToken, refreshToken })
    } catch (error) {
        res.status(401);
        throw new Error("Invalid refresh token");
    }
})




export { registerUser, loginUser, logoutUser, refreshAccessToken };