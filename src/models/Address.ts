import { Schema, model, Document } from "mongoose";
import { IUser } from "./User";

export interface IAddress extends Document {
  user: IUser | any;
  address: string;
  additionalInfo: string;
  phoneNumbers: string[];
  city: string;
  state: string;
  zipcode: string;
  country: string;
  isDefault: boolean;
}

const addressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  address: {
    type: String,
    required: [true, "address is required"],
  },
  additionalInfo: {
    type: String,
  },
  phoneNumbers: [
    {
      type: Number,
      required: true,
    },
  ],
  city: {
    type: String,
    required: [true, "city is required"],
  },
  state: {
    type: String,
    required: [true, "state is required"],
  },
  zipcode: {
    type: String,
    required: [true, "zipcode is required"],
  },
  country: {
    type: String,
    required: [true, "country is required"],
  },
  isDefault: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default model<IAddress>("Address", addressSchema);
