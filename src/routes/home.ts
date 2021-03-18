import express from "express";
import appController from '../controllers/home';

const router = express.Router();

router.route("/").get(appController);

export default router