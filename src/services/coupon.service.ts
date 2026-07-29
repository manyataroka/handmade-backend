import { HttpError } from "../errors/http-error";
import { CouponRepository } from "../repositories/coupon.repository";

const couponRepository = new CouponRepository();

export class CouponService {
    async validateCoupon(code: string, orderAmount: number) {
        const coupon = await couponRepository.findByCode(code);
        if (!coupon) {
            throw new HttpError(404, "Coupon not found");
        }
        if (!coupon.isActive) {
            throw new HttpError(400, "Coupon is no longer active");
        }
        if (new Date() > coupon.expiresAt) {
            throw new HttpError(400, "Coupon has expired");
        }
        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
            throw new HttpError(400, "Coupon usage limit reached");
        }
        if (orderAmount < coupon.minOrderAmount) {
            throw new HttpError(
                400,
                `Minimum order amount of $${coupon.minOrderAmount} required`
            );
        }

        let discountAmount = 0;
        if (coupon.discountType === "percentage") {
            discountAmount = (orderAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        } else {
            discountAmount = coupon.discountValue;
        }

        return {
            coupon: {
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
            },
            discountAmount: Math.round(discountAmount * 100) / 100,
            finalAmount: Math.round((orderAmount - discountAmount) * 100) / 100,
        };
    }
}

