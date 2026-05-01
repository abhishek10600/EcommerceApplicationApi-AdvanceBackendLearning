import { Product } from "@prisma/client";

export const toProductResponse = (product: Product) => {
  return {
    id: product.id,
    productName: product.productName,
    productDescription: product.productDescription,
    productImageUrls: product.productImagesUrls,
    price: product.price,
    stock: product.stock,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

export const toProductListResponse = (products: Product[]) => {
  return products.map(toProductResponse);
};
