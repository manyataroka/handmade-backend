// import mongoose, { Document, Schema, Types } from "mongoose";

// export interface IAddress extends Document {
//     _id: mongoose.Types.ObjectId;
//     userId: Types.ObjectId;
//     label: string;
//     fullName: string;
//     phone: string;
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//     isDefault: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// }

// const AddressSchema = new Schema<IAddress>(
//     {
//         userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
//         label: { type: String, default: "Home" },
//         fullName: { type: String, required: true },
//         phone: { type: String, required: true },
//         street: { type: String, required: true },
//         city: { type: String, required: true },
//         state: { type: String, default: "" },
//         zipCode: { type: String, required: true },
//         country: { type: String, default: "Nepal" },
//         isDefault: { type: Boolean, default: false },
//     },
//     { timestamps: true }
// );

// export const AddressModel = mongoose.model<IAddress>("Address", AddressSchema);

