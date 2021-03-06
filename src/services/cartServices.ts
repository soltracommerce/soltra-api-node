import { NextFunction } from "express";
import ErrorResponse from "../exceptions/httpException";
import {
  CreateCartDTO,
} from "./../repositories/dto/cart.dto";
import { ICartItem } from "./../models/CartItem";
import {
  createCartDB,
  findOneCart,
  AddCartItemDB,
  updateCartItemDB,
  removeCartItemDB,
} from "./../repositories/carts";

class CartService {
  static async createCart(data: CreateCartDTO, next: NextFunction) {
    const { user } = data;

    const cartByUser = await findOneCart({ user });

    if (cartByUser) {
      return next(new ErrorResponse(400, "user already has a Cart"));
    }

    const cart = await createCartDB(data);

    return cart;
  }

  static async getUserCart(userId: string) {
    const cart = await findOneCart({ user: userId });

    return cart;
  }

  static async AddCartItem(
    data: ICartItem,
    cartId: string,
    next: NextFunction
  ) {
    const cart = await findOneCart({ _id: cartId });

    if (!cart) {
      return next(new ErrorResponse(400, "Cart not found"));
    }

    if (cart.user._id.toString() !== data.user) {
      return next(
        new ErrorResponse(401, "Not Authorized to access this cart!!!")
      );
    }

    const cartItem = cart.cartItems.filter(
      (cartItem) => cartItem.product._id.toString() === data.product
    );

    if (cartItem.length > 0) {
      return next(new ErrorResponse(400, "Item already added to cart"));
    }

    const newCart = await AddCartItemDB(data, cart);

    return newCart;
  }

  static async updateCartItem(
    cartId: string,
    cartItemId: string,
    data: { quantity: number; amount: number; user: string },
    next: NextFunction
  ) {
    const cartByUser = await findOneCart({ _id: cartId });

    if (!cartByUser) {
      return next(new ErrorResponse(400, "Cart not found"));
    }

    if (cartByUser.user._id.toString() !== data.user) {
      return next(
        new ErrorResponse(401, "Not Authorized to access this cart!!!")
      );
    }

    const cartItems = cartByUser.cartItems.filter(
      (cartItem) => cartItem._id.toString() === cartItemId
    );

    if (cartItems.length === 0) {
      return next(new ErrorResponse(400, "Item not in Cart"));
    }

    const cart = await updateCartItemDB(cartByUser, cartItemId, data);

    return cart;
  }

  static async removeCartItem(
    cartId: string,
    cartItemId: string,
    user: string,
    next: NextFunction
  ) {
    const cart = await findOneCart({ _id: cartId });

    if (!cart) {
      return next(new ErrorResponse(400, "Cart not found"));
    }

    if (cart.user._id.toString() !== user) {
      return next(
        new ErrorResponse(401, "Not Authorized to access this cart!!!")
      );
    }

    const newCart = await removeCartItemDB(cart, cartItemId);

    return newCart;
  }
}

export default CartService;
