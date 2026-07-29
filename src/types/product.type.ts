import z from "zod";

export const ProductSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    description: z.string().optional(),
    price: z.number().positive({ message: "Price must be a positive number" }),
    imagePath: z.string().min(1, { message: "Image path is required" }).optional(),
    category: z.string().min(1, { message: "Category is required" }),
    stock: z.number().int().min(0).optional(),
    isFavorited: z.boolean().optional(),
    trending: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
});

export type ProductType = z.infer<typeof ProductSchema>;
