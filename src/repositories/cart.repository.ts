import { CartModel, ICart, ICartItem } from "../models/cart.model";

export class CartRepository {
    async findByUserId(userId: string): Promise<ICart | null> {
        return CartModel.findOne({ userId });
    }

    async createCart(userId: string): Promise<ICart> {
        const cart = new CartModel({ userId, items: [] });
        return cart.save();
    }

    async saveCart(cart: ICart): Promise<ICart> {
        return cart.save();
    }

    async setItems(userId: string, items: ICartItem[]): Promise<ICart | null> {
        return CartModel.findOneAndUpdate(
            { userId },
            { items },
            { new: true, upsert: true }
        );
    }
}
