import { Cart, CartItems } from "@prisma/client";
import { CartWithItems } from "../../types/index.js";

export interface ICartRepository {
  getCartByUserId(userId: string): Promise<Cart | null>;

  createCart(userId: string): Promise<Cart>;

  getCartWithItems(userId: string): Promise<CartWithItems | null>;

  getCartItemsById(cartItemId: string): Promise<any>;

  addItem(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItems>;

  updateItemQuantity(cartItemId: string, quantity: number): Promise<CartItems>;

  removeItem(cartItemId: string): Promise<void>;

  clearCart(cartId: string): Promise<void>;
}
