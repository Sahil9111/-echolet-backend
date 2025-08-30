import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';


const router = Router();

// Define user-related routes here

router.route('/register').post(upload.single("profileImage"), registerUser)
// router.route('/login').post(loginUser, authUser);

export default router;