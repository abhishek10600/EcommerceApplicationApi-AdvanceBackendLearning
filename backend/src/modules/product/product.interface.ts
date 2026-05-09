import { Prisma, Product } from "@prisma/client";
import { updateProductDTO } from "./product.schema.js";
import { ProductQueryOptions } from "../../types/index.js";

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

  getProductById(productId: string): Promise<Product | null>;

  getProductByIdAndSellerId(
    productId: string,
    sellerId: string,
  ): Promise<Product | null>;

  getAllProducts(): Promise<Product[]>;

  getAllActiveProducts(filters: ProductQueryOptions): Promise<{
    products: Product[];
    nextCursor: string | null;
    hasMore: boolean;
  }>;

  getProductsByCategoryId(categoryId: string): Promise<Product[]>;

  updateProduct(
    data: Prisma.ProductUpdateInput,
    productId: string,
    sellerId: string,
  ): Promise<Product>;

  toggleActiveProduct(
    productId: string,
    sellerId: string,
    isActive: boolean,
  ): Promise<Product>;

  deleteProduct(productId: string, sellerId: string): Promise<any>;
}
