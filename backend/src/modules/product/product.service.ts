import { Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary.helper.js";
import { IProductRepository } from "./product.interface.js";
import { createProductDTO, updateProductDTO } from "./product.schema.js";
import { toProductListResponse, toProductResponse } from "./product.mapper.js";
import { ProductQueryOptions } from "../../types/index.js";
import redis from "../../lib/redis.js";
import { invalidateProductCache } from "../../utils/cache.helper.js";

export class ProductService {
  constructor(private productRepo: IProductRepository) {}

  async createProduct(
    data: createProductDTO,
    userId: string,
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new AppError("At least one product image is required", 400);
    }

    const imageUrls = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer)),
    );

    const newProduct = await this.productRepo.createProduct({
      userId,
      categoryId: data.categoryId,
      productName: data.productName,
      productDescription: data.productDescription,
      productImagesUrls: imageUrls,
      price: new Prisma.Decimal(data.price),
      stock: Number(data.stock),
    });

    await invalidateProductCache();

    return toProductResponse(newProduct);
  }

  async getAllProducts() {
    const products = await this.productRepo.getAllProducts();

    return toProductListResponse(products);
  }

  async getProductsByCategoryId(categoryId: string) {
    const products = await this.productRepo.getProductsByCategoryId(categoryId);

    return toProductListResponse(products);
  }

  async getAllActiveProducts(filters: ProductQueryOptions) {
    const cacheKey = `products:${JSON.stringify(filters)}`;

    const cachedProducts = await redis.get(cacheKey);

    if (cachedProducts) {
      console.log("CACHE HIT");
      return JSON.parse(cachedProducts);
    }

    console.log("CACHE MISS");

    const result = await this.productRepo.getAllActiveProducts(filters);

    const formattedResult = {
      products: toProductListResponse(result.products),
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
    };

    await redis.set(cacheKey, JSON.stringify(formattedResult), "EX", 300);

    // console.log(result);

    return formattedResult;
  }

  async editProduct(
    data: updateProductDTO,
    productId: string,
    sellerId: string,
  ) {
    const existingProduct = await this.productRepo.getProductByIdAndSellerId(
      productId,
      sellerId,
    );

    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    const updateData: Prisma.ProductUpdateInput = {};

    if (data.productName !== undefined) {
      updateData.productName = data.productName;
    }

    if (data.productDescription !== undefined) {
      updateData.productDescription = data.productDescription;
    }

    if (data.price !== undefined) {
      updateData.price = data.price;
    }

    if (data.stock !== undefined) {
      updateData.stock = Number(data.stock);
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError("No valid fields provided to update.", 400);
    }

    const updatedProduct = await this.productRepo.updateProduct(
      updateData,
      productId,
      sellerId,
    );

    if (!updatedProduct) {
      throw new AppError("Product not found or unauthorized", 404);
    }

    await invalidateProductCache();

    return toProductResponse(updatedProduct);
  }

  async toggleActiveProduct(productId: string, sellerId: string) {
    const existingProduct = await this.productRepo.getProductByIdAndSellerId(
      productId,
      sellerId,
    );

    if (!existingProduct) {
      throw new AppError(
        "Product not found or you are not authorized to perform this action",
        401,
      );
    }

    const updatedProduct = await this.productRepo.toggleActiveProduct(
      productId,
      sellerId,
      !existingProduct.isActive,
    );

    await invalidateProductCache();

    return toProductResponse(updatedProduct);
  }

  async deleteProduct(productId: string, sellerId: string) {
    const existingProduct = await this.productRepo.getProductByIdAndSellerId(
      productId,
      sellerId,
    );

    if (!existingProduct) {
      throw new AppError(
        "Product not found or you are not authorized to perform this action.",
        401,
      );
    }

    const productImageUrls = existingProduct.productImagesUrls;

    productImageUrls.forEach(async (productImageUrl) => {
      await deleteFromCloudinary(productImageUrl);
    });

    await this.productRepo.deleteProduct(productId, sellerId);

    await invalidateProductCache();
  }
}
