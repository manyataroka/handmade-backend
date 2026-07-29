// import { HttpError } from "../errors/http-error";
// import { WishlistRepository } from "../repositories/wishlist.repository";
// import { ProductRepository } from "../repositories/product.repository";

// const wishlistRepository = new WishlistRepository();
// const productRepository = new ProductRepository();

// export class WishlistService {
//     private async getOrCreateWishlist(userId: string) {
//         let wishlist = await wishlistRepository.findByUserId(userId);
//         if (!wishlist) {
//             wishlist = await wishlistRepository.createWishlist(userId);
//         }
//         return wishlist;
//     }

//     async getWishlist(userId: string) {
//         const wishlist = await wishlistRepository.findByUserId(userId);
//         if (!wishlist) return [];
//         return wishlist.items.map((item) => ({
//             productId: String(item.productId),
//             addedAt: item.addedAt,
//         }));
//     }

//     async toggleItem(userId: string, productId: string) {
//         const product = await productRepository.getProductById(productId);
//         if (!product) {
//             throw new HttpError(404, "Product not found");
//         }

//         const wishlist = await this.getOrCreateWishlist(userId);
//         const existingIndex = wishlist.items.findIndex(
//             (item) => String(item.productId) === productId
//         );

//         if (existingIndex > -1) {
//             wishlist.items.splice(existingIndex, 1);
//             await wishlistRepository.saveWishlist(wishlist);
//             return { favorited: false, message: "Removed from wishlist" };
//         } else {
//             wishlist.items.push({
//                 productId: product._id,
//                 addedAt: new Date(),
//             });
//             await wishlistRepository.saveWishlist(wishlist);
//             return { favorited: true, message: "Added to wishlist" };
//         }
//     }

//     async isFavorited(userId: string, productId: string): Promise<boolean> {
//         const wishlist = await wishlistRepository.findByUserId(userId);
//         if (!wishlist) return false;
//         return wishlist.items.some((item) => String(item.productId) === productId);
//     }
// }

