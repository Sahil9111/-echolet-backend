import { Router } from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller.js';
import { verifyUser } from '../middlewares/protected.middleware.js';


const router = Router();

// Define chat-related routes here

// secure routes
router.route('/').post(verifyUser, sendMessage);
router.route('/:chatId').get(verifyUser, getMessages);

export default router;