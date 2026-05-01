import { ProductRepository } from "../product/product.repository.js";
import { CategoryRepository } from "./category.repository.js";
import { CategoryService } from "./category.service.js";

const categoryRepository = new CategoryRepository();
const productRepository = new ProductRepository();
const categoryService = new CategoryService(
  categoryRepository,
  productRepository,
);

export { categoryService };
