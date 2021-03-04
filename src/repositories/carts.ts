import Cart from "../models/Cart";
import { ICart } from "./../models/Cart";
import { ICartItem } from "./../models/CartItem";

export const findOneCart = async (query: any) => {
  const cartByUser = await Cart.findOne({ ...query })

    .populate({ path: "user", select: "firstname lastname email" })
    .populate({
      path: "cartItems.product",
      select: "name image price",
    });

  return cartByUser;
};
export const createCartDB = async (data: ICart) => {
  let cart = new Cart(data);

  cart = await cart.save();

  return cart;
};

export const AddCartItemDB = async (data: ICartItem, cart: ICart) => {
  cart?.cartItems.unshift(data);

  const new_cart_total = cart.cartItems
    .map((cartItem) => cartItem.amount)
    .reduce((a, b) => a + b, 0);

  cart.cart_total = new_cart_total;

  const newCart = await cart?.save();

  return newCart;
};

export const updateCartItemDB = async (
  cart: ICart,
  cartItemId: string,
  data: { quantity: number; amount: number }
) => {
  const cartItemIndex = cart.cartItems
    .map((cartItem) => cartItem._id.toString())
    .indexOf(cartItemId);

  cart.cartItems[cartItemIndex].quantity = data.quantity;
  cart.cartItems[cartItemIndex].amount = data.amount;

  const new_cart_total = cart.cartItems
    .map((cartItem) => cartItem.amount)
    .reduce((a, b) => a + b, 0);

  cart.cart_total = new_cart_total;

  const newCart = await cart.save();

  return newCart;
};

export const removeCartItemDB = async (cart: ICart, cartItemId: string) => {
  const cartItemIndex = cart.cartItems
    .map((cartItem) => cartItem._id.toString())
    .indexOf(cartItemId);

  cart.cartItems.splice(cartItemIndex, 1);

  const new_cart_total = cart.cartItems
    .map((cartItem) => cartItem.amount)
    .reduce((a, b) => a + b, 0);

  cart.cart_total = new_cart_total;

  const newCart = await cart.save();

  return newCart;
};
