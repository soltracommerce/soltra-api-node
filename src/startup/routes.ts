import express, { Application } from "express";
import auth from "../routes/auth";
import products from "../routes/products";
import carts from "../routes/carts";
import orders from "../routes/orders";
import address from "../routes/address";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./../middlewares/error";

const routes = (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors());
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/products", products);
  app.use("/api/v1/carts", carts);
  app.use("/api/v1/orders", orders);
  app.use("/api/v1/address", address);
  app.use(errorMiddleware as any);
};

export default routes;
