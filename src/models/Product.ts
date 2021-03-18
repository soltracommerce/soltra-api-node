import { Schema, model, Document } from "mongoose";
import { IUser } from './User';

export interface IProduct extends Document {
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  quantity: number;
  rating: number;
  numReviews: number;
  price: number;
  user: IUser
}

const reviewSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please enter product name"],
    },

    image: {
      type: String,
      required: [true, "Product Image is required"],
    },

    description: {
      type: String,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    category: {
      type: String,
      required: [true, "Category is requires"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      default: 0,
    },

    rating: {
      type: Number,
      required: [true, "Ratings is required"],
      default: 0,
    },

    reviews: [reviewSchema],

    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      default: 0,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IProduct>("Product", productSchema);
