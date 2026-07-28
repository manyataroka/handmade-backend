import { AddCartItemDTO, UpdateCartItemDTO } from "../dtos/cart.dto";
import { HttpError } from "../errors/http-error";
import { ProductRepository } from "../repositories/product.repository";
import { CartRepository } from "../repositories/cart.repository";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

function formatCartItem(item: {
    productId: { toString(): string } | string;
    name: string;
    price: number;
    imagePath: string;
    qty: number;
}) {
    return {
        id: String(item.productId),
        name: item.name,
        price: item.price,
        image: item.imagePath,
        qty: item.qty,
    };
}

export class CartService {
    private async getOrCreateCart(userId: string) {
        let cart = await cartRepository.findByUserId(userId);
        if (!cart) {
            cart = await cartRepository.createCart(userId);
        }
        return cart;
    }

    async getCart(userId: string) {
        const cart = await cartRepository.findByUserId(userId);
        const items = cart?.items ?? [];
        return items.map(formatCartItem);
    }

    async addItem(userId: string, data: AddCartItemDTO) {
        let product = null;
        if (data.productId) {
            product = await productRepository.getProductById(data.productId);
        } else if (data.productName) {
            product = await productRepository.getProductByName(data.productName);
        }

        if (!product) {
            throw new HttpError(404, "Product not found");
        }

        const cart = await this.getOrCreateCart(userId);
        const productId = String(product._id);
        const existing = cart.items.find((item) => String(item.productId) === productId);

        if (existing) {
            existing.qty += data.qty ?? 1;
        } else {
            cart.items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                imagePath: product.imagePath,
                qty: data.qty ?? 1,
            });
        }

        const saved = await cartRepository.saveCart(cart);
        return saved.items.map(formatCartItem);
    }

    async updateItemQty(userId: string, productId: string, data: UpdateCartItemDTO) {
        const cart = await cartRepository.findByUserId(userId);
        if (!cart) {
            throw new HttpError(404, "Cart not found");
        }

        const item = cart.items.find((entry) => String(entry.productId) === productId);
        if (!item) {
            throw new HttpError(404, "Item not found in cart");
        }

        item.qty = data.qty;
        const saved = await cartRepository.saveCart(cart);
        return saved.items.map(formatCartItem);
    }

    async removeItem(userId: string, productId: string) {
        const cart = await cartRepository.findByUserId(userId);
        if (!cart) {
            throw new HttpError(404, "Cart not found");
        }

        const nextItems = cart.items.filter((entry) => String(entry.productId) !== productId);
        if (nextItems.length === cart.items.length) {
            throw new HttpError(404, "Item not found in cart");
        }

        cart.items = nextItems;
        const saved = await cartRepository.saveCart(cart);
        return saved.items.map(formatCartItem);
    }

    async clearCart(userId: string) {
        const cart = await this.getOrCreateCart(userId);
        cart.items = [];
        const saved = await cartRepository.saveCart(cart);
        return saved.items.map(formatCartItem);
    }
}
