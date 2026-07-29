import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { ActivityController } from "../controllers/activity.controller";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware";

const adminController = new AdminController();
const activityController = new ActivityController();
const router = Router();

router.use(authenticateToken, requireAdmin);

router.get("/dashboard", adminController.getDashboardStats.bind(adminController));
router.get("/activities", activityController.getAllActivity.bind(activityController));
router.get("/activities/user", activityController.getUserActivity.bind(activityController));

export default router;

