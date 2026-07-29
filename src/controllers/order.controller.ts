import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CreateOrderDTO } from "../dtos/order.dto";
import { OrderService } from "../services/order.service";
import { ActivityService } from "../services/activity.service";

const orderService = new OrderService();
const activityService = new ActivityService();

export class OrderController {
    async createOrder(req: AuthRequest, res: Response) {
        try {
            const parsed = CreateOrderDTO.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: parsed.error.format() });
            }
            const userId = req.user!.id;
            const order = await orderService.placeOrder(userId, parsed.data);
            await activityService.logActivity(
                userId,
                "place_order",
                `Order placed: ${order.id} (total: $${order.total})`,
                req.ip || "",
                req.headers["user-agent"] || ""
            );
            return res.status(201).json({
                success: true,
                message: "Order placed successfully",
                data: order,
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async listOrders(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const role = req.user!.role || "user";
            const orders = await orderService.listOrders(userId, role);
            return res.status(200).json({
                success: true,
                data: orders,
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async getOrderById(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const role = req.user!.role || "user";
            const { id } = req.params;
            const order = await orderService.getOrderById(id, userId, role);
            return res.status(200).json({
                success: true,
                data: order,
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async cancelOrder(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            const order = await orderService.cancelOrder(id, userId);
            await activityService.logActivity(
                userId,
                "cancel_order",
                `Order cancelled: ${id}`,
                req.ip || "",
                req.headers["user-agent"] || ""
            );
            return res.status(200).json({
                success: true,
                message: "Order cancelled successfully",
                data: order,
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    // Admin endpoints
    async adminListOrders(req: AuthRequest, res: Response) {
        try {
            const { status, page: pageStr, limit: limitStr } = req.query;
            const page = parseInt(pageStr as string) || 1;
            const limit = parseInt(limitStr as string) || 20;
            const orders = await orderService.adminListOrders(
                status as string,
                page,
                limit
            );
            return res.status(200).json({
                success: true,
                ...orders,
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async updateOrderStatus(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!status) {
                return res.status(400).json({ success: false, message: "Status is required" });
            }
            const order = await orderService.updateOrderStatus(id, status);
            return res.status(200).json({
                success: true,
                message: "Order status updated",
                data: order,
            });
        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}
