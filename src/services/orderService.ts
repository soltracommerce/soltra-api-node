import { NextFunction } from "express";
import {findOneAddress} from "../repositories/address"
import {
  createOrderDB,
  findOneOrder,
  getOrdersDB,
  updateOrderDB,
  deleteOrderDB,
} from "./../repositories/order";
import ErrorResponse from "./../exceptions/httpException";
import { CreateOrderDTO } from './../repositories/dto/order.dto';

class OrderService {
  static async createOrder(data: CreateOrderDTO, next: NextFunction) {
    if (data.orderItems.length === 0) {
      return next(new ErrorResponse(400, "No Order Items"));
    }

    const userAddress = await findOneAddress({user: data.user, isDefault: true});

    if(userAddress) {
      data.deliveryAddress = userAddress._id
    }

    const order = await createOrderDB(data);

    return order;
  }

  static async getOrders() {
    const orders = await getOrdersDB();

    return orders;
  }

  static async getOrderByID(orderId: string, next: NextFunction) {
    const order = await findOneOrder({ _id: orderId });

    if (!order) {
      return next(new ErrorResponse(404, "Order with the ID does not exist"));
    }

    return order;
  }

  static async getMyOrder(userId: string, next: NextFunction) {
    const orders = await getOrdersDB(userId);

    if (orders.length === 0) {
      return next(new ErrorResponse(404, "User has not placed any orders"));
    }

    return orders;
  }

  static async updateOrder(data: CreateOrderDTO, orderId: string, next: NextFunction) {
    const order = await findOneOrder({ _id: orderId });

    if (!order) {
      return next(new ErrorResponse(404, "Order with the ID does not exist"));
    }

    // update payment info;
    if (data.paymentResult) {
      order.paymentResult.id = data.paymentResult.id;
      order.paymentResult.status = data.paymentResult.status;
      order.isPaid = true;
      order.paidAt = data.paidAt;
    }

    // update delivery info
    if (data.isDelivered) {
      order.isDelivered = data.isDelivered;
      order.deliveredAt = data.deliveredAt;
    }

    // call method to save to database

    const updatedOrder = await updateOrderDB(order);

    return updatedOrder;
  }

  

  static async deleteOrder(orderId: string, next: NextFunction) {
    const order = await findOneOrder({ _id: orderId });

    if (!order) {
      return next(new ErrorResponse(404, "Order with the ID does not exist"));
    }

    const deletedOrder = await deleteOrderDB(order);

    return deletedOrder;
  }
}

export default OrderService;
