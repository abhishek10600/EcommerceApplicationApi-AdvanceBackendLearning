import { OrderRepository } from "./order.repository.js";
import { OrderService } from "./order.service.js";

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);

export { orderService };
