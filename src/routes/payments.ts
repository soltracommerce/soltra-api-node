import express from "express";
import {
  initialTransaction,
  verifyTransaction,
  getATransaction,
  getUsersTransactions
} from "./../controllers/payment";
import authMiddleware from "./../middlewares/auth";
import validate from "./../middlewares/validator";
import { validatePaymentRules } from "../middlewares/validatorRules";
import { validatePaymentId } from "../middlewares/validateObjectId";

const router = express.Router();

router
  .route("/pay")
  .post(authMiddleware, validatePaymentRules(), validate, initialTransaction);

router.route("/callback").get(verifyTransaction);

router.route("/my_receipts").get(authMiddleware, getUsersTransactions)

router.route("/receipt/:paymentId").get(authMiddleware, validatePaymentId, getATransaction);

export default router;
