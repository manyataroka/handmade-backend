import mongoose, { Document, Schema } from "mongoose";

export interface ICoupon extends Document {
    _id: mongoose.Types.ObjectId;
    code: string;
    description: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderAmount: number;
    maxDiscount: number;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        description: { type: String, default: "" },
        discountType: { type: String, enum: ["percentage", "fixed"], required: true },
        discountValue: { type: Number, required: true, min: 0 },
        minOrderAmount: { type: Number, default: 0, min: 0 },
        maxDiscount: { type: Number, default: 0, min: 0 },
        usageLimit: { type: Number, default: 0, min: 0 },
        usedCount: { type: Number, default: 0, min: 0 },
        isActive: { type: Boolean, default: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

export const CouponModel = mongoose.model<ICoupon>("Coupon", CouponSchema);

