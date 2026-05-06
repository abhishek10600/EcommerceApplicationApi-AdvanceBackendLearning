import { ProductRepository } from "../product/product.repository.js";
import { CartRepository } from "./cart.repository.js";
import { CartService } from "./cart.service.js";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const cartService = new CartService(cartRepository, productRepository);

export { cartService };
