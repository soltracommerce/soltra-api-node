import express from "express";
import authMiddleware from './../middlewares/auth';
import {validateShopRules} from "./../middlewares/validatorRules";
import validate from "./../middlewares/validator";

const router = express.Router();

router.route("/").post().get()
router.route("/:shopId").get().put().delete();

export default router;