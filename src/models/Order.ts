import { Schema, model, Document } from "mongoose";
import cartItemSchema from "./CartItem";
import { ICartItem } from "./CartItem";
import { IUser } from './User';

export interface IOrder extends Document {
  user: IUser | any;
  orderItems: ICartItem[];
  deliveryAddress: string;
  itemsPrice: number;
  taxPrice: number;
  deliveryFee: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt: Date;
  deliveredAt: Date;
  paymentMethod: string,
  deliveryMethod: string,
  paymentResult: {
    id: number,
    status: string
    reference: string;
  }
}

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    orderItems: [cartItemSchema],
    paymentMethod: {
      type: String,
      required: true,
    },
  
    paymentResult: {
      id: {
        type: Number,
      },
      status: {
        type: String,
      },
      reference: {
        type: String
      }
    },
    deliveryAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address"
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IOrder>("Order", orderSchema);
