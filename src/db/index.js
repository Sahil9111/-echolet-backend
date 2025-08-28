import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
    console.log(`Database connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("Error while connecting to Mongo database", error);
    process.exit(1);
  }
}

export default connectDB;