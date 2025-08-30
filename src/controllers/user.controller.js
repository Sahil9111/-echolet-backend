import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async(req, res) => {

//   Registration logic here
  const { username, email, password, bio } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const userExists = await User.findOne({email})
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
    }else {
        res.status(201).json({ message: "User registered successfully", user });
    }
})



export { registerUser };