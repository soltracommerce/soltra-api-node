import { Schema, model, Document } from "mongoose";
import cartItemSchema from "./CartItem";
import { IUser } from './User';
import { ICartItem } from './CartItem';

export interface ICart extends Document {
  cart_total: number;
  user: IUser;
  cartItems:ICartItem[]
}

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  cartItems: [cartItemSchema],
  cart_total: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default model<ICart>("Cart", cartSchema);
