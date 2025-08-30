import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config({quiet: true});

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadToCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      return null;
    }
    const result = await cloudinary.uploader.upload(filePath, { resource_type: "auto" });
    console.log("file uploaded successfully", result.url);
    // Remove file from server after upload
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    fs.unlinkSync(filePath);
    return null;
    }
};

export { uploadToCloudinary };




