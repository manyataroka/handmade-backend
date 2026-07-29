// import { ActivityRepository } from "../repositories/activity.repository";
// import { ActivityAction } from "../models/activity.model";

// const activityRepository = new ActivityRepository();

// export class ActivityService {
//     async logActivity(
//         userId: string,
//         action: ActivityAction,
//         details: string = "",
//         ipAddress: string = "",
//         userAgent: string = ""
//     ) {
//         try {
//             await activityRepository.log({ userId, action, details, ipAddress, userAgent });
//         } catch (err) {
//             console.warn("Failed to log activity:", err);
//         }
//     }

//     async getUserActivity(userId: string, limit?: number) {
//         return activityRepository.findByUserId(userId, limit);
//     }

//     async getAllActivity(limit?: number) {
//         return activityRepository.getAll(limit);
//     }
// }

