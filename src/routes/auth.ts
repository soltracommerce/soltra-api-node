import express, { Router } from "express";
import { validateLogin, validateUser } from "../middlewares/validator";
import loginUser from "../controllers/auth/loginUser";
import confirmEmail from "../controllers/auth/confirmEmail";
import registerUser from "../controllers/auth/registerUser";
import resetPassword from "../controllers/auth/resetPassword";
import updatePassword from "../controllers/auth/updatePassword";
import forgotPassword from "../controllers/auth/forgotPassword";
import authMiddleware from "./../middlewares/auth";

const router: Router = express.Router();

router.route("/register").post(validateUser, registerUser);
router.route("/login").post(validateLogin, loginUser);
router.route("/confirmemail").get(confirmEmail);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resettoken").put(resetPassword);
router.route("/updatepassword").put(authMiddleware, updatePassword);

export default router;
