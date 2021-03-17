import Cart from "../models/Cart";
import { ICart } from "./../models/Cart";
import { CreateCartDTO } from "../dto/cart.dto";

export const findOneCart = async (query: any): Promise<ICart | null> => {
  const cartByUser = await Cart.findOne({ ...query })

    .populate({ path: "user", select: "firstname lastname email" })
    .populate({
      path: "cartItems.product",
      select: "name image price",
    });

  return cartByUser;
};

export const findAllCartsDB = async (): Promise<ICart[]> => {
  const carts = await Cart.find()
    .populate("user", "firstname lastname email")
    .populate("cartItems.product", "name image price");

  return carts;
};

export const createCartDB = async (data: CreateCartDTO): Promise<ICart> => {
  let cart = new Cart(data);

  cart = await cart.save();

  return cart;
};

export const updateCartDB = async (cart: ICart): Promise<ICart> => {
  const newCart = await cart.save();

  return newCart;
};
