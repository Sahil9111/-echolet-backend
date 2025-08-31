import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import { verifyUser } from '../middlewares/protected.middleware.js';


const router = Router();

// Define user-related routes here

router.route('/register').post(upload.single("profileImage"), registerUser)
router.route('/login').post(loginUser);
router.route('/logout').post(verifyUser, logoutUser);

export default router;