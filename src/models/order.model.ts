import mongoose, { Document, Schema, Types } from "mongoose";

export type OrderStatus = "Processing" | "Shipped" | "Delivered";

export interface IOrderItem {
    productId?: Types.ObjectId;
    name: string;
    price: number;
    imagePath: string;
    qty: number;
}

export interface IOrder extends Document {
    _id: mongoose.Types.ObjectId;
    userId: Types.ObjectId;
    items: IOrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    totalItems: number;
    address: string;
    phone: string;
    paymentMethod: string;
    notes?: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        imagePath: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        items: { type: [OrderItemSchema], required: true },
        subtotal: { type: Number, required: true, min: 0 },
        shipping: { type: Number, required: true, min: 0, default: 0 },
        total: { type: Number, required: true, min: 0 },
        totalItems: { type: Number, required: true, min: 1 },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        paymentMethod: { type: String, required: true, default: "Cash on Delivery" },
        notes: { type: String },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered"],
            default: "Processing",
        },
    },
    {
        timestamps: true,
    }
);

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
