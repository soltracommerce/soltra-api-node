import express from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from './../middlewares/admin';
import { validateOrderId } from "./../middlewares/validateObjectId";
import { validateOrderRules } from './../middlewares/validatorRules';
import validate from "../middlewares/validator"
import {

  createOrder,
  getOrders,
  getSingleOrder,
  getUserOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  deleteOrder,
} from "../controllers/order";

const router = express.Router();

router.route("/").post(authMiddleware, createOrder).get(authMiddleware, adminMiddleware, getOrders);
router.route("/my_orders").get(authMiddleware, getUserOrders);
router
  .route("/paid/:orderId")
  .put(authMiddleware, validateOrderRules(), validate, validateOrderId, updateOrderToPaid);
router
  .route("/delivered/:orderId")
  .put(authMiddleware, validateOrderId, updateOrderToDelivered);
router
  .route("/:orderId")
  .get(authMiddleware, validateOrderId, getSingleOrder)
  .delete(authMiddleware, validateOrderId, deleteOrder);

export default router;
