// import mongoose, { Document, Schema } from "mongoose";
// import { ProductType } from "../types/product.type";

// const ProductSchema: Schema = new Schema<ProductType>(
//     {
//         name: { type: String, required: true, unique: true },
//         description: { type: String, default: "" },
//         price: { type: Number, required: true },
//         imagePath: { type: String },
//         category: { type: String, required: true },
//         stock: { type: Number, default: 0 },
//         isFavorited: { type: Boolean, default: false },
//         trending: { type: Boolean, default: false },
//         isNewArrival: { type: Boolean, default: false },
//     },
//     {
//         timestamps: true,
//     }
// );

// export interface IProduct extends ProductType, Document {
//     _id: mongoose.Types.ObjectId;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
