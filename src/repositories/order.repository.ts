import { OrderModel, IOrder, IOrderItem } from "../models/order.model";

export interface CreateOrderParams {
    userId: string;
    items: IOrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    totalItems: number;
    address: string;
    phone: string;
    paymentMethod: string;
    notes?: string;
}

export class OrderRepository {
    findOrders(query: any, page: number, limit: number) {
        throw new Error("Method not implemented.");
    }
    countOrders(query: any) {
        throw new Error("Method not implemented.");
    }
    async create(params: CreateOrderParams): Promise<IOrder> {
        const order = new OrderModel(params);
        return order.save();
    }

    async findByUserId(userId: string): Promise<IOrder[]> {
        return OrderModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }

    async findAllWithUser(): Promise<IOrder[]> {
        return OrderModel.find()
            .sort({ createdAt: -1 })
            .populate("userId", "email username firstName lastName role")
            .exec() as Promise<IOrder[]>;
    }

    async findById(orderId: string): Promise<IOrder | null> {
        return OrderModel.findById(orderId).exec();
    }
}
