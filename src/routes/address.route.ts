import { Router } from "express";
import { AddressController } from "../controllers/address.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const addressController = new AddressController();
const router = Router();

router.use(authenticateToken);

router.get("/", addressController.listAddresses.bind(addressController));
router.get("/:id", addressController.getAddress.bind(addressController));
router.post("/", addressController.createAddress.bind(addressController));
router.put("/:id", addressController.updateAddress.bind(addressController));
router.delete("/:id", addressController.deleteAddress.bind(addressController));

export default router;

