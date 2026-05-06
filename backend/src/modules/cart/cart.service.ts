import { Prisma } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { IProductRepository } from "../product/product.interface.js";
import { ICartRepository } from "./cart.interface.js";
import { addToCartDTO, updateCartItemDTO } from "./cart.schema.js";

export class CartService {
  constructor(
    private cartRepo: ICartRepository,
    private productRepo: IProductRepository,
  ) {}

  async addToCart(userId: string, data: addToCartDTO) {
    const { productId, quantity } = data;

    if (quantity <= 0) {
      throw new AppError("Quantity must be greater than 0", 400);
    }

    let cart = await this.cartRepo.getCartByUserId(userId);

    if (!cart) {
      cart = await this.cartRepo.createCart(userId);
    }

    const product = await this.productRepo.getProductById(productId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (!product.isActive) {
      throw new AppError("Product is not available", 400);
    }

    if (product.stock < quantity) {
      throw new AppError("Insufficient stock", 400);
    }

    return this.cartRepo.addItem(cart.id, productId, quantity);
  }

  async getCart(userId: string) {
    const cart = await this.cartRepo.getCartWithItems(userId);

    if (!cart) {
      return {
        items: [],
        totalPrice: new Prisma.Decimal(0),
        totalItems: 0,
      };
    }

    let totalPrice = new Prisma.Decimal(0);
    let totalItems = 0;

    const formattedItems = cart.items.map((item) => {
      const isAvailable = item.product.isActive;

      if (isAvailable) {
        const itemTotal = item.product.price.mul(item.quantity);
        totalPrice = totalPrice.add(itemTotal);
        totalItems += item.quantity;
      }

      return {
        ...item,
        isAvailable: true,
      };
    });

    return {
      id: cart.id,
      items: formattedItems,
      totalPrice,
      totalItems,
    };
  }

  async updateCartItem(cartItemId: string, data: updateCartItemDTO) {
    const { quantity } = data;

    if (quantity <= 0) {
      await this.cartRepo.removeItem(cartItemId);
      return null;
    }

    const cartItem = await this.cartRepo.getCartItemsById(cartItemId);

    if (!cartItem) {
      throw new AppError("Cart item not found", 404);
    }

    if (cartItem.product.stock < quantity) {
      throw new AppError("Insufficient stock", 400);
    }

    return this.cartRepo.updateItemQuantity(cartItemId, quantity);
  }

  async removeCartItem(cartItemId: string) {
    await this.cartRepo.removeItem(cartItemId);
  }

  async clearCart(userId: string) {
    const cart = await this.cartRepo.getCartByUserId(userId);

    if (!cart) {
      throw new AppError(
        "Cart not found or you are unauthorized to perform this action",
        401,
      );
    }

    await this.cartRepo.clearCart(cart.id);
  }
}
