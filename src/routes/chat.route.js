import { Router } from 'express';
import { accessChat, fetchChat, createGroupChat, renameGroup, removeFromGroup, addToGroup, groupMembers} from '../controllers/chat.controller.js';
import { verifyUser } from '../middlewares/protected.middleware.js';


const router = Router();

// Define chat-related routes here

// secure routes
router.route('/').post(verifyUser, accessChat);
router.route('/').get(verifyUser, fetchChat);
router.route('/group').post(verifyUser, createGroupChat);
router.route('/rename').put(verifyUser, renameGroup);
router.route('/group-remove').put(verifyUser, removeFromGroup);
router.route('/group-add').put(verifyUser, addToGroup);
router.route('/group-members/:chatId').get(verifyUser, groupMembers);

export default router;