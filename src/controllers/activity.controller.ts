// import { Response } from "express";
// import { AuthRequest } from "../middlewares/auth.middleware";
// import { ActivityService } from "../services/activity.service";

// const activityService = new ActivityService();

// export class ActivityController {
//     async getUserActivity(req: AuthRequest, res: Response) {
//         try {
//             const userId = req.user!.id;
//             const limit = parseInt(req.query.limit as string) || 20;
//             const activities = await activityService.getUserActivity(userId, limit);
//             return res.status(200).json({ success: true, data: activities });
//         } catch (error: any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }

//     async getAllActivity(req: AuthRequest, res: Response) {
//         try {
//             const limit = parseInt(req.query.limit as string) || 50;
//             const activities = await activityService.getAllActivity(limit);
//             return res.status(200).json({ success: true, data: activities });
//         } catch (error: any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }
// }
