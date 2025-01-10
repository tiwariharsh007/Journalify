import express from 'express';
import { getuser, signin, signout, signup } from '../controllers/authController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/signout').get(signout);
router.route("/me").get(verifyToken, getuser);

export default router;
