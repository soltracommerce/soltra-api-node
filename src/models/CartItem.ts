import { Schema, Document } from "mongoose";
import { IProduct } from "./Product";
import { IUser } from './User';

export interface ICartItem extends Document {
  _id: Schema.Types.ObjectId;
  user: IUser
  quantity: number;
  amount: number;
  status: string;
  product: IProduct;
}

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Not Processed",
    enum: ["Not Processed", "Processed", "Shipped", "Delivered", "Canceled"],
  },
});

export default cartItemSchema;
