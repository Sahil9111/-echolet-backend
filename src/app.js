import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';



const app = express()


app.use(cors({
    origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
    credentials: true
}))

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from './routes/user.route.js'
import chatRouter from './routes/chat.route.js'
import messageRouter from './routes/message.route.js'

// Routes declaration
app.use('/api/v1/user', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/message', messageRouter);


export default app;