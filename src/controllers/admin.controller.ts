// import { Response } from "express";
// import { AuthRequest } from "../middlewares/auth.middleware";
// import { UserModel } from "../models/user.model";
// import { ProductModel } from "../models/product.model";
// import { OrderModel } from "../models/order.model";

// export class AdminController {
//     async getDashboardStats(req: AuthRequest, res: Response) {
//         try {
//             const totalUsers = await UserModel.countDocuments();
//             const totalProducts = await ProductModel.countDocuments();
//             const totalOrders = await OrderModel.countDocuments();
//             const totalRevenue = await OrderModel.aggregate([
//                 { $group: { _id: null, total: { $sum: "$total" } } },
//             ]);
//             const recentOrders = await OrderModel.find()
//                 .sort({ createdAt: -1 })
//                 .limit(5)
//                 .populate("userId", "email username")
//                 .exec();

//             return res.status(200).json({
//                 success: true,
//                 data: {
//                     stats: {
//                         totalUsers,
//                         totalProducts,
//                         totalOrders,
//                         totalRevenue: totalRevenue[0]?.total || 0,
//                     },
//                     recentOrders,
//                 },
//             });
//         } catch (error: any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }
// }

