import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true, trim: true,
            lowercase: true,
            index: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true, trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        profileImage: {
            type: String,
            // required: true,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        },
        bio: { type: String }
    },
    { timestamps: true }
)

const User = mongoose.model("User", userSchema);
export default User;