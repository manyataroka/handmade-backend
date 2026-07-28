import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const orderController = new OrderController();
const router = Router();

router.use(authenticateToken);

router.post("/", orderController.createOrder.bind(orderController));
router.get("/", orderController.listOrders.bind(orderController));

export default router;
