import Order from "../models/Order";
import { IOrder } from "./../models/Order";
import { CreateOrderDTO } from "../dto/order.dto";

export const findOneOrder = async (query: any): Promise<IOrder | null> => {
  const order = await Order.findOne({ ...query })
    .populate("user", "firstname lastname email")
    .populate(
      "deliveryAddress",
      "address city state phoneNumbers country isDefault"
    );

  return order;
};

export const createOrderDB = async (data: CreateOrderDTO): Promise<IOrder> => {
  let order = new Order(data);

  order = await order.save();

  return order;
};

export const getOrdersDB = async (userId?: string): Promise<IOrder[]> => {
  const order = await Order.find(userId ? { user: userId } : {})
    .populate("user", "firstname lastname email")
    .populate(
      "deliveryAddress",
      "address city state phoneNumbers country isDefault"
    );

  return order;
};

export const updateOrderDB = async (order: IOrder): Promise<IOrder> => {
  const updatedOrder = await order.save();

  return updatedOrder;
};

export const deleteOrderDB = async (order: IOrder): Promise<IOrder> => {
  const deletedOrder = await order.remove();

  return deletedOrder;
};
