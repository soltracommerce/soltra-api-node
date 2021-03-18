import { NextFunction } from "express";
import ErrorResponse from "../exceptions/httpException";
import { CreateCartDTO, CreateCartItemDTO } from "../dto/cart.dto";
import { ICartItem } from "./../models/CartItem";
import { ICart } from "./../models/Cart";
import {
  createCartDB,
  findAllCartsDB,
  findOneCart,
  updateCartDB,
} from "./../repositories/carts";

class CartService {
  static async createCart(
    data: CreateCartDTO,
    next: NextFunction
  ): Promise<void | ICart> {
    const { user } = data;

    const cartByUser = await findOneCart({ user });

    if (cartByUser) {
      return next(new ErrorResponse(400, "User already has a cart"));
    }

    const cart = await createCartDB(data);

    return cart;
  }

  static async getCarts(): Promise<ICart[]> {
    const carts = await findAllCartsDB();

    return carts;
  }

  static async getCartByID(
    cartId: string,
    next: NextFunction
  ): Promise<void | ICart> {
    const cart = await findOneCart({ _id: cartId });

    if (!cart) {
      return next(new ErrorResponse(404, "Cart not found"));
    }

    return cart;
  }

  static async getUserCart(
    userId: string,
    next: NextFunction
  ): Promise<void | ICart> {
    const cart = await findOneCart({ user: userId });

    if (!cart) {
      return next(new ErrorResponse(404, "User has no cart"));
    }

    return cart;
  }

  static async AddCartItem(
    data: ICartItem,
    cartId: string,
    next: NextFunction
  ): Promise<void | ICart> {
    const cart = await findOneCart({ _id: cartId });

    if (!cart) {
      return next(new ErrorResponse(400, "Cart not found"));
    }

    if (cart.user._id.toString() !== data.user) {
      return next(
        new ErrorResponse(401, "User not authorized to access this cart!")
      );
    }

    const cartItem = cart.cartItems.filter(
      (cartItem) => cartItem.product._id.toString() === data.product
    );

    if (cartItem.length > 0) {
      return next(new ErrorResponse(400, "Item already added to cart"));
    }

    cart?.cartItems.unshift(data);

    const new_cart_total = cart.cartItems
      .map((cartItem) => cartItem.amount)
      .reduce((a, b) => a + b, 0);

    cart.cart_total = new_cart_total;

    const newCart = await updateCartDB(cart);

    return newCart;
  }

  static async updateCartItem(
    cartId: string,
    cartItemId: string,
    data: CreateCartItemDTO,
    next: NextFunction
  ): Promise<void | ICart> {
    const cart = await findOneCart({ _id: cartId });

    if (!cart) {
      return next(new ErrorResponse(400, "Cart not found"));
    }

    if (cart.user._id.toString() !== data.user) {
      return next(
        new ErrorResponse(401, "User not authorized to access this cart!")
      );
    }

    const cartItems = cart.cartItems.filter(
      (cartItem) => cartItem._id.toString() === cartItemId
    );

    if (cartItems.length === 0) {
      return next(new ErrorResponse(400, "Item not in user's cart"));
    }

    const cartItemIndex = cart.cartItems
      .map((cartItem) => cartItem._id.toString())
      .indexOf(cartItemId);

    cart.cartItems[cartItemIndex].quantity = data.quantity;
    cart.cartItems[cartItemIndex].amount = data.amount;
    cart.cartItems[cartItemIndex].status = data.status;

    const new_cart_total = cart.cartItems
      .map((cartItem) => cartItem.amount)
      .reduce((a, b) => a + b, 0);

    cart.cart_total = new_cart_total;

    const newCart = await updateCartDB(cart);

    return newCart;
  }

  static async removeCartItem(
    cartId: string,
    cartItemId: string,
    user: string,
    next: NextFunction
  ): Promise<void | ICart> {
    const cart = await findOneCart({ _id: cartId });

    if (!cart) {
      return next(new ErrorResponse(400, "Cart not found"));
    }

    if (cart.user._id.toString() !== user) {
      return next(
        new ErrorResponse(401, "User not authorized to access this cart!")
      );
    }

    const cartItemIndex = cart.cartItems
      .map((cartItem) => cartItem._id.toString())
      .indexOf(cartItemId);

    cart.cartItems.splice(cartItemIndex, 1);

    const new_cart_total = cart.cartItems
      .map((cartItem) => cartItem.amount)
      .reduce((a, b) => a + b, 0);

    cart.cart_total = new_cart_total;

    const newCart = await updateCartDB(cart);

    return newCart;
  }
}

export default CartService;
