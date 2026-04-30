import { Product } from "@prisma/client";

export interface IProductRepository {
  createProduct(data: {
    userId: string;
    categoryId: string;
    productName: string;
    productDescription: string;
    productImagesUrls: string[];
    price: any;
    stock: number;
  }): Promise<Product>;
}
