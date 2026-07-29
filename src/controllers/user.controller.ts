import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { UserService } from "../services/user.service";
import { ActivityService } from "../services/activity.service";

const userService = new UserService();
const activityService = new ActivityService();

export class UserController {
    async getProfile(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const user = await userService.getUserById(userId);
            return res.status(200).json({ success: true, data: user });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async updateProfile(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const { firstName, lastName, username } = req.body;
            const user = await userService.updateProfile(userId, { firstName, lastName, username });
            await activityService.logActivity(
                userId,
                "update_profile",
                "Updated profile information",
                req.ip || "",
                req.headers["user-agent"] || ""
            );
            return res.status(200).json({ success: true, message: "Profile updated", data: user });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async changePassword(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const { currentPassword, newPassword } = req.body;
            await userService.changePassword(userId, currentPassword, newPassword);
            await activityService.logActivity(
                userId,
                "change_password",
                "Password changed",
                req.ip || "",
                req.headers["user-agent"] || ""
            );
            return res.status(200).json({ success: true, message: "Password changed successfully" });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    // Admin endpoints
    async listUsers(req: AuthRequest, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const result = await userService.listAllUsers(page, limit);
            return res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async getUserById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            return res.status(200).json({ success: true, data: user });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async toggleUserRole(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const user = await userService.toggleUserRole(id);
            return res.status(200).json({ success: true, message: "User role updated", data: user });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async deleteUser(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            await userService.deleteUser(id);
            return res.status(200).json({ success: true, message: "User deleted" });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}

