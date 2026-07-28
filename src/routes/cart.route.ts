import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const cartController = new CartController();
const router = Router();

router.use(authenticateToken);

router.get("/", cartController.getCart.bind(cartController));
router.post("/items", cartController.addItem.bind(cartController));
router.put("/items/:productId", cartController.updateItem.bind(cartController));
router.delete("/items/:productId", cartController.removeItem.bind(cartController));
router.delete("/", cartController.clearCart.bind(cartController));

export default router;
