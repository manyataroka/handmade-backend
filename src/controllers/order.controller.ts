import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CreateOrderDTO } from "../dtos/order.dto";
import { OrderService } from "../services/order.service";

const orderService = new OrderService();

export class OrderController {
    async createOrder(req: AuthRequest, res: Response) {
        try {
            const parsed = CreateOrderDTO.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: parsed.error.format() });
            }
            const userId = req.user!.id;
            const order = await orderService.placeOrder(userId, parsed.data);
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
}
