import { z } from "zod";

export const CreateOrderDTO = z.object({
    address: z.string().min(2, "Address is required"),
    phone: z.string().min(6, "Phone number is required"),
    paymentMethod: z.string().min(1, "Payment method is required").default("Cash on Delivery"),
    notes: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderDTO>;
