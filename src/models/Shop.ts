import { Schema, model, Document } from "mongoose";

interface IShop extends Document {
  name: string;
  image: string;
  description: string;
}

const shopSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Shop name is required"],
    },
    image: {
      type: String,
      required: [true, "Shop Image is required"],
    },
    description: {
      type: String,
      required: [true, "Shop's description is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IShop>("User", shopSchema);
