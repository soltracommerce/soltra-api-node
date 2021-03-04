import express from "express";
import authMiddleware from "../middlewares/auth";
import { createCart, addToCart, removeCartItem, getUserCart, updateCartItem } from "./../controllers/carts";

const router = express.Router();

router.route("/").post(authMiddleware, createCart)
router.route("/my_cart").get(authMiddleware, getUserCart)
router.route("/add_item/:productId/:cartId").put(authMiddleware, addToCart);
router.route("/update_item/:cartId/:cartItemId").put(authMiddleware, updateCartItem)
router
  .route("/remove_item/:cartId/:cartItemId")
  .delete(authMiddleware, removeCartItem);

export default router;
