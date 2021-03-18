import express from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from './../middlewares/admin';
import {
  validateCartId,
  validateCartItemId,
 validateProductId,
} from "../middlewares/validateObjectId";
import {
  createCart,
  getAllCarts,
  getCart,
  addToCart,
  removeCartItem,
  getUserCart,
  updateCartItem,
} from "./../controllers/carts";

const router = express.Router();

router.route("/").post(authMiddleware, createCart).get(authMiddleware, adminMiddleware, getAllCarts);
router.route("/:cartId").get(authMiddleware, adminMiddleware, validateCartId, getCart)
router.route("/my_cart").get(authMiddleware, getUserCart);
router.route("/add_item/:productId/:cartId").put(authMiddleware, validateProductId, validateCartId, addToCart);
router
  .route("/update_item/:cartId/:cartItemId")
  .put(authMiddleware, validateCartId, validateCartItemId, updateCartItem);
router
  .route("/remove_item/:cartId/:cartItemId")
  .delete(authMiddleware, validateCartId, validateCartItemId, removeCartItem);

export default router;