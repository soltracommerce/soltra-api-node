import { Schema, model, Document } from "mongoose";

export interface IPayment extends Document {
  fullname: string;
  email: string;
  amount: number;
  currency: string;
  payment_id: number;
  payment_reference: string;
  status: string;
  payment_date: Date;
}

const paymentSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  payment_id: {
    type: Number,
    required: true,
  },
  payment_reference: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: false,
  },
  payment_date: {
    type: Date,
    required: true,
  },
});

export default model<IPayment>("Payment", paymentSchema);
