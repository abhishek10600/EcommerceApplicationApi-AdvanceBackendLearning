import { Order, OrderStatus } from "@prisma/client";

export interface IOrderRepository {
  getOrderById(orderId: string): Promise<Order | null>;

  getOrdersByUserId(userId: string): Promise<Order[]>;

  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
}
