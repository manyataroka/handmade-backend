// import mongoose, { Document, Schema, Types } from "mongoose";

// export interface ICartItem {
//     productId: Types.ObjectId;
//     name: string;
//     price: number;
//     imagePath: string;
//     qty: number;
// }

// export interface ICart extends Document {
//     _id: mongoose.Types.ObjectId;
//     userId: Types.ObjectId;
//     items: ICartItem[];
//     createdAt: Date;
//     updatedAt: Date;
// }

// const CartItemSchema = new Schema<ICartItem>(
//     {
//         productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
//         name: { type: String, required: true },
//         price: { type: Number, required: true },
//         imagePath: { type: String, required: true },
//         qty: { type: Number, required: true, min: 1, default: 1 },
//     },
//     { _id: false }
// );

// const CartSchema = new Schema<ICart>(
//     {
//         userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
//         items: { type: [CartItemSchema], default: [] },
//     },
//     {
//         timestamps: true,
//     }
// );

// export const CartModel = mongoose.model<ICart>("Cart", CartSchema);
