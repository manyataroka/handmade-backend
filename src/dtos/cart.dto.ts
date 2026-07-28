import { CartItemSchema, UpdateCartItemSchema } from "../types/cart.type";
import z from "zod";

export const AddCartItemDTO = CartItemSchema;
export type AddCartItemDTO = z.infer<typeof AddCartItemDTO>;

export const UpdateCartItemDTO = UpdateCartItemSchema;
export type UpdateCartItemDTO = z.infer<typeof UpdateCartItemDTO>;
