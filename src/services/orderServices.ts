import { findOneAddress } from "../repositories/address";
import { IOrder } from "./../models/Order";
import {
  createOrderDB,
  findOneOrder,
  getOrdersDB,
  updateOrderDB,
  deleteOrderDB,
} from "../repositories/order";
import ErrorResponse from "../exceptions/httpException";
import { CreateOrderDTO, updateOrderDTO } from "../dto/order.dto";

class OrderService {
  static async createOrder(data: CreateOrderDTO): Promise<void | IOrder> {
    if (data.orderItems.length === 0) {
      throw new ErrorResponse(400, "No Order Items");
    }

    const userAddress = await findOneAddress({
      user: data.user,
      isDefault: true,
    });

    if (userAddress) {
      data.deliveryAddress = userAddress._id;
    }

    const order = await createOrderDB(data);

    return order;
  }

  static async getOrders(): Promise<IOrder[]> {
    const orders = await getOrdersDB();

    return orders;
  }

  static async getOrderByID(orderId: string): Promise<void | IOrder> {
    const order = await findOneOrder({ _id: orderId });

    if (!order) {
      throw new ErrorResponse(404, "Order not found");
    }

    return order;
  }

  static async getMyOrders(userId: string): Promise<void | IOrder[]> {
    const orders = await getOrdersDB(userId);

    if (orders.length === 0) {
      throw new ErrorResponse(404, "User has not placed any orders");
    }

    return orders;
  }

  static async updateToPaid(
    data: updateOrderDTO,
    orderId: string
  ): Promise<void | IOrder> {
    const order = await findOneOrder({ _id: orderId });

    if (!order) {
      throw new ErrorResponse(404, "Order not found");
    }

    order.paymentResult.id = data.payment_id;
    order.paymentResult.status = data.payment_status;
    order.isPaid = true;
    order.paidAt = data.payment_date;
    order.paymentResult.reference = data.payment_reference;

    const updatedOrder = await updateOrderDB(order);

    return updatedOrder;
  }

  static async updateToDelivered(orderId: string): Promise<void | IOrder> {
    const order = await findOneOrder({ _id: orderId });

    if (!order) {
      throw new ErrorResponse(404, "Order not found");
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await updateOrderDB(order);

    return updatedOrder;
  }

  static async deleteOrder(
    orderId: string,
    userId: string
  ): Promise<void | IOrder> {
    const order = await findOneOrder({ _id: orderId });

    if (!order) {
      throw new ErrorResponse(404, "Order not found");
    }

    if (order.user._id.toString() !== userId) {
      throw new ErrorResponse(
        401,
        "User is not authorized to delete this order"
      );
    }

    const deletedOrder = await deleteOrderDB(order);

    return deletedOrder;
  }
}

export default OrderService;
