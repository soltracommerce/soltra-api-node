import "express-async-errors"; //No need to rap routes middleware around async middleware
import "dotenv/config";
import express, { Application } from "express";
import routes from "./startup/routes";
import colors from "colors/safe";
import logger from "./startup/logger";
import connectDB from "./startup/db";

const app: Application = express();

// Connect to database
connectDB();

// routes
routes(app);

// Unhandled Exceptions
process.on("uncaughtException", (ex: Error) => {
  logger.error(ex.message, ex);
  process.exit(1);
});

// Unhandled Rejection
process.on("unhandledRejection", (ex: Error) => {
  logger.error(ex.message, ex);
  process.exit(1);
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () =>
  logger.info(colors.yellow(`listening on port ${port}`))
);
export default server;
