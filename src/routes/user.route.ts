import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware";

const userController = new UserController();
const router = Router();

router.use(authenticateToken);

router.get("/profile", userController.getProfile.bind(userController));
router.put("/profile", userController.updateProfile.bind(userController));
router.put("/password", userController.changePassword.bind(userController));

// Admin routes
router.get("/", requireAdmin, userController.listUsers.bind(userController));
router.get("/:id", requireAdmin, userController.getUserById.bind(userController));
router.put("/:id/role", requireAdmin, userController.toggleUserRole.bind(userController));
router.delete("/:id", requireAdmin, userController.deleteUser.bind(userController));

export default router;

