import { OrderStatus, Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { IOrderRepository } from "./order.interface.js";
import { createOrderDTO, updateOrderStatusDTO } from "./order.schema.js";
import { prisma } from "../../lib/prisma.js";

export class OrderService {
  constructor(private orderRepo: IOrderRepository) {}

  async createOrder(userId: string, data: createOrderDTO) {
    const { items, addressId } = data;

    if (!items || items.length === 0) {
      throw new AppError("Order must contain at least one item.", 400);
    }

    return await prisma.$transaction(async (tx) => {
      const address = await tx.address.findUnique({
        where: {
          id: addressId,
        },
      });

      if (!address || address.userId !== userId) {
        throw new AppError("Invalid address", 400);
      }

      const productIds = items.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );

      let totalPrice = new Prisma.Decimal(0);
      let totalItems = 0;

      const orderItemsData = [];

      for (const item of items) {
        const product = productMap.get(item.productId);

        if (!product) {
          throw new AppError("Product not found", 404);
        }

        if (!product.isActive) {
          throw new AppError("Product is not available", 400);
        }

        const updatedStock = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: {
              gte: item.quantity,
            },
            isActive: true,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updatedStock.count === 0) {
          throw new AppError("Insufficient stock", 400);
        }

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

      await tx.orderAddress.create({
        data: {
          orderId: order.id,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          pinCode: address.pinCode,
          country: address.country,
        },
      });

      const fullOrder = await tx.order.findUnique({
        where: {
          id: order.id,
        },
        include: {
          items: true,
          orderAddress: true,
        },
      });

      return fullOrder;
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
