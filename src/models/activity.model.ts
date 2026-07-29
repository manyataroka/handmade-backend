import mongoose, { Document, Schema, Types } from "mongoose";

export type ActivityAction =
    | "login"
    | "register"
    | "logout"
    | "place_order"
    | "cancel_order"
    | "add_to_cart"
    | "remove_from_cart"
    | "add_to_wishlist"
    | "update_profile"
    | "change_password";

export interface IActivity extends Document {
    _id: mongoose.Types.ObjectId;
    userId: Types.ObjectId;
    action: ActivityAction;
    details: string;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        action: {
            type: String,
            enum: [
                "login", "register", "logout", "place_order", "cancel_order",
                "add_to_cart", "remove_from_cart", "add_to_wishlist",
                "update_profile", "change_password",
            ],
            required: true,
        },
        details: { type: String, default: "" },
        ipAddress: { type: String, default: "" },
        userAgent: { type: String, default: "" },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

// Index for faster queries
ActivitySchema.index({ userId: 1, createdAt: -1 });

export const ActivityModel = mongoose.model<IActivity>("Activity", ActivitySchema);

