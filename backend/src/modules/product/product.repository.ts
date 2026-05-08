import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { IProductRepository } from "./product.interface.js";
import { updateProductDTO } from "./product.schema.js";
import { ProductQueryOptions } from "../../types/index.js";
import e from "cors";

export class ProductRepository implements IProductRepository {
  async createProduct(data: {
    userId: string;
    categoryId: string;
    productName: string;
    productDescription: string;
    productImagesUrls: string[];
    price: any;
    stock: number;
  }) {
    const newProduct = await prisma.product.create({
      data,
    });

    return newProduct;
  }

  async getProductById(productId: string) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    return product;
  }

  async getProductByIdAndSellerId(productId: string, sellerId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: sellerId,
      },
    });

    return product;
  }

  async getAllProducts() {
    const products = await prisma.product.findMany();

    return products;
  }

  async getAllActiveProducts(filters: ProductQueryOptions) {
    const { categoryId, minPrice, maxPrice, sortBy } = filters;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // filter by price
    if (minPrice || maxPrice) {
      where.price = {};

      if (minPrice) {
        where.price.gte = new Prisma.Decimal(minPrice);
      }

      if (maxPrice) {
        where.price.lte = new Prisma.Decimal(maxPrice);
      }
    }

    // sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = {
      createdAt: "desc",
    };

    if (sortBy === "latest") {
      orderBy = { createdAt: "desc" };
    }

    if (sortBy === "oldest") {
      orderBy = { createdAt: "asc" };
    }

    if (sortBy === "priceAsc") {
      orderBy = { price: "asc" };
    }

    if (sortBy === "priceDesc") {
      orderBy = { price: "desc" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    return products;
  }

  async getProductsByCategoryId(categoryId: string) {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
      },
    });

    return products;
  }

  async updateProduct(
    data: Prisma.ProductUpdateInput,
    productId: string,
    sellerId: string,
  ) {
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
        userId: sellerId,
      },
      data,
    });

    return updatedProduct;
  }

  async toggleActiveProduct(
    productId: string,
    sellerId: string,
    isActive: boolean,
  ) {
    const product = await prisma.product.update({
      where: {
        id: productId,
        userId: sellerId,
      },
      data: {
        isActive,
      },
    });

    return product;
  }

  async deleteProduct(productId: string, sellerId: string) {
    await prisma.product.delete({
      where: {
        id: productId,
        userId: sellerId,
      },
    });
  }
}
