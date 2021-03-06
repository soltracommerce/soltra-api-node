import express from "express";
import authMiddleware from "../middlewares/auth";
import {
  createOrder,
  getOrders,
  getSingleOrder,
  getUserOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order";

const router = express.Router();

router.route("/").post(authMiddleware, createOrder).get(getOrders);
router.route("/my_order").get(authMiddleware, getUserOrder);
router
  .route("/:orderId")
  .get(authMiddleware, getSingleOrder)
  .put(authMiddleware, updateOrder)
  .delete(authMiddleware, deleteOrder);

export default router;
