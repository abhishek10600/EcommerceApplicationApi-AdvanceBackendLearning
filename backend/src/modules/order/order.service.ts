import { OrderStatus, Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { IOrderRepository } from "./order.interface.js";
import { createOrderDTO, updateOrderStatusDTO } from "./order.schema.js";
import { prisma } from "../../lib/prisma.js";

export class OrderService {
  constructor(private orderRepo: IOrderRepository) {}

  async createOrder(userId: string, data: createOrderDTO) {
    const { items } = data;

    if (!items || items.length === 0) {
      throw new AppError("Order must contain at least one item.", 400);
    }

    return await prisma.$transaction(async (tx) => {
      let totalPrice = new Prisma.Decimal(0);
      let totalItems = 0;

      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },
        });

        if (!product) {
          throw new AppError("Product not found.", 404);
        }

        if (!product.isActive) {
          throw new AppError(`${product.productName} is not available`, 400);
        }

        if (product.stock < item.quantity) {
          throw new AppError(
            `Insufficient stock for ${product.productName}`,
            400,
          );
        }

        await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        const itemTotal = product.price.mul(item.quantity);

        totalPrice = totalPrice.add(itemTotal);
        totalItems += item.quantity;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          totalItems,
          status: OrderStatus.PENDING,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });
  }

  async getMyOrders(userId: string) {
    const orders = await this.orderRepo.getOrdersByUserId(userId);

    return orders;
  }

  async updateOrderStatus(orderId: string, data: updateOrderStatusDTO) {
    const { status } = data;

    const existingOrder = await this.orderRepo.getOrderById(orderId);

    if (!existingOrder) {
      throw new AppError("Order not found", 404);
    }

    const updatedOrder = await this.orderRepo.updateOrderStatus(
      orderId,
      status,
    );

    return updatedOrder;
  }

  async cancelOrder(orderId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          items: true,
        },
      });

      if (!order) {
        throw new AppError("Order not found", 404);
      }

      if (order.userId !== userId) {
        throw new AppError("Unauthorized", 403);
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new AppError("Only pending orders can be cancelled.", 400);
      }

      for (const item of order.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.CANCELLED,
        },
      });
    });
  }
}
