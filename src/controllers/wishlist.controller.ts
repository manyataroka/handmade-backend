// import { Response } from "express";
// import { AuthRequest } from "../middlewares/auth.middleware";
// import { WishlistService } from "../services/wishlist.service";
// import { ActivityService } from "../services/activity.service";

// const wishlistService = new WishlistService();
// const activityService = new ActivityService();

// export class WishlistController {
//     async getWishlist(req: AuthRequest, res: Response) {
//         try {
//             const userId = req.user!.id;
//             const items = await wishlistService.getWishlist(userId);
//             return res.status(200).json({ success: true, data: items });
//         } catch (error: any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }

//     async toggleItem(req: AuthRequest, res: Response) {
//         try {
//             const userId = req.user!.id;
//             const { productId } = req.params;
//             const result = await wishlistService.toggleItem(userId, productId);
//             await activityService.logActivity(
//                 userId,
//                 "add_to_wishlist",
//                 `${result.favorited ? "Added to" : "Removed from"} wishlist: ${productId}`,
//                 req.ip || "",
//                 req.headers["user-agent"] || ""
//             );
//             return res.status(200).json({ success: true, ...result });
//         } catch (error: any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }

//     async checkFavorited(req: AuthRequest, res: Response) {
//         try {
//             const userId = req.user!.id;
//             const { productId } = req.params;
//             const favorited = await wishlistService.isFavorited(userId, productId);
//             return res.status(200).json({ success: true, data: { favorited } });
//         } catch (error: any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }
// }

