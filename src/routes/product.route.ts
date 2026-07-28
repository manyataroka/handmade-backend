import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware";

const productController = new ProductController();
const router = Router();

// Public routes - anyone can list/read products
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected admin routes - only admins can create, update, delete
router.post("/", authenticateToken, requireAdmin, productController.createProduct);
router.put("/:id", authenticateToken, requireAdmin, productController.updateProduct);
router.delete("/:id", authenticateToken, requireAdmin, productController.deleteProduct);

export default router;
