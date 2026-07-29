import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CouponService } from "../services/coupon.service";

const couponService = new CouponService();

export class CouponController {
    async validateCoupon(req: AuthRequest, res: Response) {
        try {
            const { code } = req.body;
            const { total } = req.query;
            const orderAmount = parseFloat(total as string) || 0;

            if (!code) {
                return res.status(400).json({ success: false, message: "Coupon code is required" });
            }

            const result = await couponService.validateCoupon(code, orderAmount);
            return res.status(200).json({ success: true, message: "Coupon applied", data: result });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}

