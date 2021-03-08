import mongoose from "mongoose";
import logger from "../startup/logger";
import colors from "colors/safe";

const connectDB = async () => {
  let MONGO_URI;
  if (process.env.NODE_ENV === "production"){
    MONGO_URI = process.env.MONGO_URI_PROD
  }
  if (process.env.NODE_ENV === "development") {
    MONGO_URI = process.env.MONGO_URI_DEV;
  }
  if (process.env.NODE_ENV === "test") {
    MONGO_URI = process.env.MONGO_URI_TEST;
  }
  try {
    const conn = await mongoose.connect(`${MONGO_URI}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    logger.info(colors.blue(`Connected to MongoDB: ${conn.connection.host}`));
  } catch (error) {
    logger.error(colors.red("Could not connect to mongoDB"), error);
  }
};

export default connectDB;
