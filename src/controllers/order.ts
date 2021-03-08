import { Request, Response, NextFunction } from "express";
import OrderService from "./../services/orderService";

export const createOrder = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  req.body.user = req.user.id;

  const order = await OrderService.createOrder(req.body, next);

  res.status(201).send(order);
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orders = await OrderService.getOrders();

  res.status(200).send(orders);
};

export const getUserOrder = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const order = await OrderService.getMyOrder(req.user.id, next);

  if (order) {
    res.status(200).send(order);
  }
};

export const getSingleOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;

  const order = await OrderService.getOrderByID(orderId, next);

  if (order) {
    res.status(200).send(order);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;

  const updatedOrder = await OrderService.updateOrder(req.body, orderId, next);

  if (updatedOrder) {
    res.status(200).send(updatedOrder);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;

  const deletedOrder = await OrderService.deleteOrder(orderId, next);

  if (deletedOrder) {
    res.status(200).send(deletedOrder);
  }
};
