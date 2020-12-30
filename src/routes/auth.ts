import express, { Router } from "express";
import { loginUser, registerUser, confirmEmail, forgotPassword, resetPassword, updatePassword } from "../controllers/auth";
import { validateLogin, validateUser } from "../middlewares/validator";
import authMiddleware from './../middlewares/auth';

const router: Router = express.Router();

router.route("/register").post(validateUser, registerUser);
router.route("/login").post(validateLogin, loginUser);
router.route("/confirmemail").get(confirmEmail);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resettoken").put(resetPassword);
router.route("/updatepassword").put(authMiddleware, updatePassword)

export default router;
