import mongoose from "mongoose";
import logger from "../startup/logger";
import colors from "colors/safe";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
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
