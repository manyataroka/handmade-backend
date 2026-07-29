import { CouponModel, ICoupon } from "../models/coupon.model";

export class CouponRepository {
    async findByCode(code: string): Promise<ICoupon | null> {
        return CouponModel.findOne({ code: code.toUpperCase() });
    }

    async create(data: Partial<ICoupon>): Promise<ICoupon> {
        const coupon = new CouponModel(data);
        return coupon.save();
    }

    async getAll(): Promise<ICoupon[]> {
        return CouponModel.find().sort({ createdAt: -1 });
    }

    async update(id: string, data: Partial<ICoupon>): Promise<ICoupon | null> {
        return CouponModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await CouponModel.findByIdAndDelete(id);
        return result ? true : false;
    }

    async incrementUsedCount(code: string): Promise<void> {
        await CouponModel.findOneAndUpdate(
            { code: code.toUpperCase() },
            { $inc: { usedCount: 1 } }
        );
    }
}

