import { ProductRepository } from "./product.repository.js";
import { ProductService } from "./product.service.js";

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

export { productService };
