import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const wishlistController = new WishlistController();
const router = Router();

router.use(authenticateToken);

router.get("/", wishlistController.getWishlist.bind(wishlistController));
router.post("/:productId", wishlistController.toggleItem.bind(wishlistController));
router.get("/check/:productId", wishlistController.checkFavorited.bind(wishlistController));

export default router;

