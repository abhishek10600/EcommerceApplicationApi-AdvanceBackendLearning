import { OrderStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { IOrderRepository } from "./order.interface.js";

export class OrderRepository implements IOrderRepository {
  async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
      },
    });

    return order;
  }

  async getOrdersByUserId(userId: string) {
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        orderAddress: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });

    return updatedOrder;
  }
}
