import { Router } from 'express';
import { registerUser, loginUser, logoutUser, refreshAccessToken, allUsers } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import { verifyUser } from '../middlewares/protected.middleware.js';


const router = Router();

// Define user-related routes here

router.route('/register').post(upload.single("profileImage"), registerUser)
router.route('/login').post(loginUser);

// secure routes
router.route('/logout').post(verifyUser, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/').get(verifyUser, allUsers);

export default router;