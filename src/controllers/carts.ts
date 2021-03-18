import { Request, Response, NextFunction } from "express";
import CartService from "../services/cartServices";
import ErrorResponse from "./../exceptions/httpException";

export const createCart = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  req.body.user = req.user.id;

  const cart = await CartService.createCart(req.body, next);

  res.status(201).send(cart);
};

export const getAllCarts = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const cart = await CartService.getCarts();

  res.status(200).send(cart);
};

export const getCart = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { cartId } = req.params;

  const cart = await CartService.getCartByID(cartId, next);

  if (cart) {
    res.status(200).send(cart);
  }
};

export const getUserCart = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const cart = await CartService.getUserCart(req.user.id, next);

  if (cart) {
    res.status(200).send(cart);
  }
};

export const addToCart = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { productId, cartId } = req.params;

  req.body.user = req.user.id;

  req.body.product = productId;

  const cart = await CartService.AddCartItem(req.body, cartId, next);

  if (cart) {
    res.status(200).send(cart);
  }
};

export const updateCartItem = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { cartId, cartItemId } = req.params;

  req.body.user = req.user.id;

  const cart = await CartService.updateCartItem(
    cartId,
    cartItemId,
    req.body,
    next
  );

  if (cart) {
    res.status(200).send(cart);
  }
};

export const removeCartItem = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { cartId, cartItemId } = req.params;

  const user = req.user.id;

  const deletedCartItem = await CartService.removeCartItem(
    cartId,
    cartItemId,
    user,
    next
  );

  if (deletedCartItem) {
    res.status(200).send(deletedCartItem);
  }
};
