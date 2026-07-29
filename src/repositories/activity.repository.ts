// import { ActivityModel, IActivity, ActivityAction } from "../models/activity.model";

// export class ActivityRepository {
//     async log(params: {
//         userId: string;
//         action: ActivityAction;
//         details?: string;
//         ipAddress?: string;
//         userAgent?: string;
//     }): Promise<IActivity> {
//         const activity = new ActivityModel(params);
//         return activity.save();
//     }

//     async findByUserId(userId: string, limit: number = 20): Promise<IActivity[]> {
//         return ActivityModel.find({ userId })
//             .sort({ createdAt: -1 })
//             .limit(limit)
//             .exec();
//     }

//     async getAll(limit: number = 50): Promise<IActivity[]> {
//         return ActivityModel.find()
//             .sort({ createdAt: -1 })
//             .limit(limit)
//             .populate("userId", "email username firstName lastName")
//             .exec();
//     }
// }

