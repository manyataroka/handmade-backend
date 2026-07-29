// import { Response } from "express";
// import { AuthRequest } from "../middlewares/auth.middleware";
// import { AddressService } from "../services/address.service";

// const addressService = new AddressService();

// export class AddressController {
//     async listAddresses(req: AuthRequest, res: Response) {
//         try {
//             const userId = req.user!.id;
//             const addresses = await addressService.listAddresses(userId);
//             return res.status(200).json({ success: true, data: addresses });
//         } catch (error: any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }

//     async getAddress(req: AuthRequest, res: Response) {
//         try {
//             const userId = req.user!.id;
//             const { id } = req.params;
//             const address = await addressService.getAddressById(userId, id);
//             return res.status(200).json({ success: true, data: address });
//         } catch (error: any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }

//     async createAddress(req: AuthRequest, res: Response) {
//         try {
//             const userId = req.user!.id;
//             const address = await addressService.createAddress(userId, req.body);
//             return res.status(201).json({ success: true, message: "Address created", data: address });
//         } catch (error: any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }

//     async updateAddress(req: AuthRequest, res: Response) {
//         try {
//             const userId = req.user!.id;
//             const { id } = req.params;
//             const address = await addressService.updateAddress(userId, id, req.body);
//             return res.status(200).json({ success: true, message: "Address updated", data: address });
//         } catch (error: any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }

//     async deleteAddress(req: AuthRequest, res: Response) {
//         try {
//             const userId = req.user!.id;
//             const { id } = req.params;
//             await addressService.deleteAddress(userId, id);
//             return res.status(200).json({ success: true, message: "Address deleted" });
//         } catch (error: any) {
//             return res.status(error.statusCode ?? 500).json({
//                 success: false,
//                 message: error.message || "Internal Server Error",
//             });
//         }
//     }
// }

