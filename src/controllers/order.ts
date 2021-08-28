import { Request, Response, NextFunction } from "express";
import OrderService from "../services/orderServices";

export const createOrder = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  req.body.user = req.user.id;

  const order = await OrderService.createOrder(req.body);

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

export const getUserOrders = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const order = await OrderService.getMyOrders(req.user.id);

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

  const order = await OrderService.getOrderByID(orderId);

  if (order) {
    res.status(200).send(order);
  }
};

export const updateOrderToPaid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;

  const updatedOrder = await OrderService.updateToPaid(req.body, orderId);

  if (updatedOrder) {
    res.status(200).send(updatedOrder);
  }
};

export const updateOrderToDelivered = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;

  const updatedOrder = await OrderService.updateToDelivered(orderId);

  if (updatedOrder) {
    res.status(200).send(updatedOrder);
  }
};

export const deleteOrder = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;

  const deletedOrder = await OrderService.deleteOrder(orderId, req.user.id);

  if (deletedOrder) {
    res.status(200).send(deletedOrder);
  }
};
