import { ProductService } from "../services/product.service";
import { CreateProductDTO } from "../dtos/product.dto";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";

const productService = new ProductService();

export class ProductController {
    async createProduct(req: AuthRequest, res: Response) {
        try {
            const parsedData = CreateProductDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({ success: false, message: parsedData.error.format() });
            }
            const created = await productService.createProduct(parsedData.data);
            return res.status(201).json({ success: true, message: "Product created", data: created });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async getAllProducts(req: Request, res: Response) {
        try {
            const { search, category, minPrice, maxPrice, sort, page: pageStr, limit: limitStr, trending, isNewArrival } = req.query;
            const page = parseInt(pageStr as string) || 1;
            const limit = parseInt(limitStr as string) || 20;
            const filters: any = {};
            if (category) filters.category = category as string;
            if (minPrice) filters.minPrice = parseFloat(minPrice as string);
            if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
            if (trending === 'true') filters.trending = true;
            if (isNewArrival === 'true') filters.isNewArrival = true;

            const result = await productService.getAllProducts({
                search: search as string,
                filters,
                sort: sort as string,
                page,
                limit,
            });
            return res.status(200).json({ success: true, ...result });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);
            return res.status(200).json({ success: true, data: product });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async getRelatedProducts(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const limit = parseInt(req.query.limit as string) || 4;
            const products = await productService.getRelatedProducts(id, limit);
            return res.status(200).json({ success: true, data: products });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async updateProduct(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const parsedData = CreateProductDTO.partial().safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({ success: false, message: parsedData.error.format() });
            }
            const updated = await productService.updateProduct(id, parsedData.data);
            return res.status(200).json({ success: true, message: "Product updated", data: updated });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async deleteProduct(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            await productService.deleteProduct(id);
            return res.status(200).json({ success: true, message: "Product deleted" });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}
