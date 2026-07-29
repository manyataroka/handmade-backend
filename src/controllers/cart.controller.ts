// import { Response } from "express";
// import { AuthRequest } from "../middlewares/auth.middleware";
// import { AddCartItemDTO, UpdateCartItemDTO } from "../dtos/cart.dto";
// import { CartService } from "../services/cart.service";

// const cartService = new CartService();

// export class CartController {
//     async getCart(req: AuthRequest, res: Response) {
//         try {
//             const userId = req.user!.id;
//             const items = await cartService.getCart(userId);
//             return res.status(200).json({ success: true, data: items });
//         } catch (error: Error | any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }

//     async addItem(req: AuthRequest, res: Response) {
//         try {
//             const parsed = AddCartItemDTO.safeParse(req.body);
//             if (!parsed.success) {
//                 return res.status(400).json({ success: false, message: parsed.error.format() });
//             }

//             const userId = req.user!.id;
//             const items = await cartService.addItem(userId, parsed.data);
//             return res.status(200).json({ success: true, message: "Item added to cart", data: items });
//         } catch (error: Error | any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }

//     async updateItem(req: AuthRequest, res: Response) {
//         try {
//             const parsed = UpdateCartItemDTO.safeParse(req.body);
//             if (!parsed.success) {
//                 return res.status(400).json({ success: false, message: parsed.error.format() });
//             }

//             const userId = req.user!.id;
//             const { productId } = req.params;
//             const items = await cartService.updateItemQty(userId, productId, parsed.data);
//             return res.status(200).json({ success: true, message: "Cart updated", data: items });
//         } catch (error: Error | any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }

//     async removeItem(req: AuthRequest, res: Response) {
//         try {
//             const userId = req.user!.id;
//             const { productId } = req.params;
//             const items = await cartService.removeItem(userId, productId);
//             return res.status(200).json({ success: true, message: "Item removed", data: items });
//         } catch (error: Error | any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }

//     async clearCart(req: AuthRequest, res: Response) {
//         try {
//             const userId = req.user!.id;
//             const items = await cartService.clearCart(userId);
//             return res.status(200).json({ success: true, message: "Cart cleared", data: items });
//         } catch (error: Error | any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }
// }
