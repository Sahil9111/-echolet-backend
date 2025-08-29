import dotenv from "dotenv";
import app from "./app.js";
import connectDB from './db/index.js'
// import userRoutes from './routes/user.route.js'

dotenv.config({ path: '.env', quiet: true });

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on  http://localhost:${process.env.PORT || 3000}`);
  })
}).catch((error) => {
  console.error("Database connection error:", error);
});
