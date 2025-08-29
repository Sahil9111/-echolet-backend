import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';

const router = Router();

// Define user-related routes here

router.route('/register').post(registerUser)
// router.route('/login').post(loginUser, authUser);

export default router;