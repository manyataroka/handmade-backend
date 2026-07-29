import { Router } from "express";
import { CouponController } from "../controllers/coupon.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const couponController = new CouponController();
const router = Router();

router.use(authenticateToken);

router.post("/validate", couponController.validateCoupon.bind(couponController));

export default router;

