import z from "zod";

export const CartItemSchema = z.object({
    productId: z.string().min(1).optional(),
    productName: z.string().min(1).optional(),
    qty: z.number().int().positive().optional().default(1),
}).refine((data) => !!(data.productId || data.productName), {
    message: "Either productId or productName is required",
});

export type CartItemInput = z.infer<typeof CartItemSchema>;

export const UpdateCartItemSchema = z.object({
    qty: z.number().int().positive({ message: "Quantity must be at least 1" }),
});

export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
