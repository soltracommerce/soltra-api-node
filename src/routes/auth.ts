import express, { Router } from "express";
import {
  validateLoginRules,
  validateUserRules,
} from "../middlewares/validatorRules";
import validate from "./../middlewares/validator";
import {
  registerUser,
  loginUser,
  confirmEmail,
  forgotPassword,
  resetPassword,
  updatePassword
} from "../controllers/auth";

import authMiddleware from "./../middlewares/auth";

const router: Router = express.Router();

router.route("/register").post(validateUserRules(), validate, registerUser);
router.route("/login").post(validateLoginRules(), validate, loginUser);
router.route("/confirmemail").get(confirmEmail);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resettoken").put(resetPassword);
router.route("/updatepassword").put(authMiddleware, updatePassword);

export default router;
