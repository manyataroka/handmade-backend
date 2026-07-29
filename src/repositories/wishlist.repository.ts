import { WishlistModel, IWishlist } from "../models/wishlist.model";

export class WishlistRepository {
    async findByUserId(userId: string): Promise<IWishlist | null> {
        return WishlistModel.findOne({ userId }).populate("items.productId");
    }

    async createWishlist(userId: string): Promise<IWishlist> {
        const wishlist = new WishlistModel({ userId, items: [] });
        return wishlist.save();
    }

    async saveWishlist(wishlist: IWishlist): Promise<IWishlist> {
        return wishlist.save();
    }
}

