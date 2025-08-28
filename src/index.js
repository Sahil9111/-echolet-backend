import dotenv from "dotenv";
import app from "./app.js";
// import mongoose from "mongoose";
import connectDB from './db/index.js'

dotenv.config({ path: '.env', quiet: true });

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port ${process.env.PORT || 3000}`);
  })
}).catch((error) => {
  console.error("Database connection error:", error);
});
