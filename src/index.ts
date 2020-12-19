import express, { Application, Request, Response } from "express";
import cors from "cors"
import "dotenv/config";
import colors from "colors/safe";
import logger from "./startup/logger";
import connectDB from "./startup/db";

const app: Application = express();

// Connect to database
connectDB();

// Unhandled Exceptions
process.on("uncaughtException", (ex: Error) => {
  logger.error(ex.message, ex)
  process.exit(1)
})

// Unhandled Rejection
process.on("unhandledRejection", (ex: Error) => {
  logger.error(ex.message, ex)
  process.exit(1)
})

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello Oga Bros!!!");
});


const port = process.env.PORT || 8080;
app.listen(port, () => logger.info(colors.yellow(`listening on port ${port}`)));
