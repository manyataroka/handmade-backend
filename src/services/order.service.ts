import { CreateOrderInput } from "../dtos/order.dto";
import { HttpError } from "../errors/http-error";
import { OrderRepository } from "../repositories/order.repository";
import { CartRepository } from "../repositories/cart.repository";
import { IOrder, IOrderItem, OrderStatus } from "../models/order.model";

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
}
