import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/user.model.js';

const registerUser = asyncHandler(async(req, res) => {

//   Registration logic here
  const { username, email, password, profileImage, bio } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400);
        throw new Error("User already exists with this email");
    }
    const user = await User.create({ username, email, password, profileImage, bio });
    if (!user) {
        res.status(400);
        throw new Error("Failed to create user");
    }else {
        res.status(201).json({ message: "User registered successfully", user });
    }
})



export { registerUser };