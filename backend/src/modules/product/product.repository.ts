import { prisma } from "../../lib/prisma.js";
import { IProductRepository } from "./product.interface.js";

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
}
