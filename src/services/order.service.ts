import { CreateOrderInput } from "../dtos/order.dto";
import { HttpError } from "../errors/http-error";
import { OrderRepository } from "../repositories/order.repository";
import { CartRepository } from "../repositories/cart.repository";
import { IOrder, IOrderItem, OrderStatus } from "../models/order.model";
import { paginationMetadata } from "../utils/response";

const orderRepository = new OrderRepository();
const cartRepository = new CartRepository();

export interface OrderResponseItem {
    productId?: string;
    name: string;
    price: number;
    image: string;
    qty: number;
}

export interface OrderUserInfo {
    id: string;
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
}

export interface OrderResponse {
    id: string;
    date: string;
    total: number;
    items: number;
    address: string;
    payment: string;
    status: OrderStatus;
    notes?: string;
    phone: string;
    subtotal: number;
    shipping: number;
    lineItems: OrderResponseItem[];
    user?: OrderUserInfo;
}

function formatDate(d: Date): string {
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }) + " at " + d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function mapOrderItemsToResponse(items: IOrderItem[]): OrderResponseItem[] {
    return items.map((it) => ({
        productId: it.productId ? String(it.productId) : undefined,
        name: it.name,
        price: it.price,
        image: it.imagePath,
        qty: it.qty,
    }));
}

function formatOrder(order: IOrder, includeUser: boolean = false): OrderResponse {
    const base: OrderResponse = {
        id: String(order._id),
        date: formatDate(order.createdAt),
        total: order.total,
        items: order.totalItems,
        address: order.address,
        payment: order.paymentMethod,
        status: order.status,
        notes: order.notes,
        phone: order.phone,
        subtotal: order.subtotal,
        shipping: order.shipping,
        lineItems: mapOrderItemsToResponse(order.items),
    };
    if (includeUser) {
        const userRef: any = (order as any).userId;
        if (userRef && typeof userRef === "object" && (userRef._id || userRef.id)) {
            const uid = userRef._id || userRef.id;
            base.user = {
                id: String(uid),
                email: userRef.email,
                username: userRef.username,
                firstName: userRef.firstName,
                lastName: userRef.lastName,
            };
            (base.user as any).role = userRef.role;
        } else if (userRef) {
            base.user = { id: String(userRef) };
        }
    }
    return base;
}

export class OrderService {
    async placeOrder(userId: string, input: CreateOrderInput): Promise<OrderResponse> {
        const cart = await cartRepository.findByUserId(userId);
        if (!cart || cart.items.length === 0) {
            throw new HttpError(400, "Your cart is empty");
        }

        const items: IOrderItem[] = cart.items.map((c) => ({
            productId: c.productId,
            name: c.name,
            price: c.price,
            imagePath: c.imagePath,
            qty: c.qty,
        }));

        const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
        const shipping = subtotal > 0 ? 99 : 0;
        const total = subtotal + shipping;
        const totalItems = items.reduce((s, it) => s + it.qty, 0);

        const order = await orderRepository.create({
            userId,
            items,
            subtotal,
            shipping,
            total,
            totalItems,
            address: input.address,
            phone: input.phone,
            paymentMethod: input.paymentMethod,
            notes: input.notes,
        });

        cart.items = [];
        await cartRepository.saveCart(cart);

        return formatOrder(order);
    }

    async listOrders(userId: string, role: string = "user"): Promise<OrderResponse[]> {
        if (role === "admin") {
            const orders = await orderRepository.findAllWithUser();
            return orders.map((o) => formatOrder(o, true));
        }
        const orders = await orderRepository.findByUserId(userId);
        return orders.map((o) => formatOrder(o));
    }

    async getOrderById(orderId: string, userId: string, role: string = "user"): Promise<OrderResponse> {
        const order = await orderRepository.findById(orderId);
        if (!order) {
            throw new HttpError(404, "Order not found");
        }
        if (role !== "admin" && String(order.userId) !== userId) {
            throw new HttpError(403, "You can only view your own orders");
        }
        return formatOrder(order, role === "admin");
    }

    async cancelOrder(orderId: string, userId: string): Promise<OrderResponse> {
        const order = await orderRepository.findById(orderId);
        if (!order) {
            throw new HttpError(404, "Order not found");
        }
        if (String(order.userId) !== userId) {
            throw new HttpError(403, "You can only cancel your own orders");
        }
        if (order.status !== "Processing") {
            throw new HttpError(400, "Only orders in 'Processing' status can be cancelled");
        }
        order.status = "Cancelled" as OrderStatus;
        await order.save();
        return formatOrder(order);
    }

    async adminListOrders(status?: string, page: number = 1, limit: number = 20) {
        const query: any = {};
        if (status) {
            const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
            if (validStatuses.includes(status)) {
                query.status = status;
            }
        }

        const total = await orderRepository.countOrders(query);
        const orders = await orderRepository.findOrders(query, page, limit);
        const data = orders.map((o) => formatOrder(o, true));

        return {
            data,
            metadata: paginationMetadata(total, page, limit),
        };
    }

    async updateOrderStatus(orderId: string, status: string): Promise<OrderResponse> {
        const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            throw new HttpError(400, `Invalid status. Valid values: ${validStatuses.join(", ")}`);
        }

        const order = await orderRepository.findById(orderId);
        if (!order) {
            throw new HttpError(404, "Order not found");
        }

        order.status = status as OrderStatus;
        await order.save();
        return formatOrder(order, true);
    }
}

// Extend OrderStatus type to include Cancelled
export type { OrderStatus };
