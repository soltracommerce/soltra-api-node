import "dotenv/config";
import User from "./models/User";
import Product from "./models/Product";
import connectDB from "./startup/db";
import users from "./data/users";
import products from "./data/products";
import colors from "colors/safe";
import logger from "./startup/logger";

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const createdUsers:any = await User.insertMany(users as any);

    const user = createdUsers[0]._id
    const sampleProducts = products.map(product => {
      return {...product, user }
    })

    await Product.insertMany(sampleProducts)

    logger.info(colors.green("Data Imported!"));
    process.exit();
  } catch (error) {
    logger.error(colors.red(`${error}`));
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    logger.info(colors.red("Data Destroyed!"));
    process.exit();
  } catch (error) {
    logger.error(colors.red(`${error}`));
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
