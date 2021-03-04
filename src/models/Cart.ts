import { Schema, model, Document } from "mongoose";
import cartItemSchema from "./CartItem";
import { IUser } from './User';
import { IProduct } from './Product';

export interface ICart extends Document {
  cart_total: number;
  user: IUser
  cartItems: {
    _id: Schema.Types.ObjectId;
    quantity: number;
    amount: number;
    status: string;
    product: IProduct;
  }[];
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
