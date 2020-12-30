import express, { Application } from "express";
import auth from "../routes/auth"
import cors from "cors";
import cookieParser from "cookie-parser";
const errorMiddleware = require("../middlewares/error")

const routes = (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser())
  app.use(cors())
  app.use("/api/v1/auth", auth)
  app.use(errorMiddleware)
};

export default routes;
