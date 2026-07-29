import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dto";
import { ProductRepository } from "../repositories/product.repository";
import { HttpError } from "../errors/http-error";
import { paginationMetadata } from "../utils/response";

const productRepository = new ProductRepository();

export class ProductService {
    async createProduct(data: CreateProductDTO) {
        const existing = await productRepository.getProductByName(data.name);
        if (existing) {
            throw new HttpError(409, "A product with this name already exists");
        }
        const created = await productRepository.createProduct(data);
        const obj: any = created.toObject ? created.toObject() : created;
        return obj;
    }

    async getAllProducts(params?: {
        search?: string;
        filters?: { category?: string; minPrice?: number; maxPrice?: number; trending?: boolean; isNewArrival?: boolean };
        sort?: string;
        page?: number;
        limit?: number;
    }) {
        const { search, filters, sort, page = 1, limit = 20 } = params || {};

        // Build MongoDB query
        const query: any = {};
        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [
                { name: regex },
                { description: regex },
                { category: regex },
            ];
        }
        if (filters?.category) {
            query.category = filters.category;
        }
        if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
            query.price = {};
            if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
            if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
        }
        if (filters?.trending !== undefined) query.trending = filters.trending;
        if (filters?.isNewArrival !== undefined) query.isNewArrival = filters.isNewArrival;

        // Build sort
        let sortOption: any = { createdAt: -1 };
        if (sort) {
            switch (sort) {
                case "price_asc": sortOption = { price: 1 }; break;
                case "price_desc": sortOption = { price: -1 }; break;
                case "name_asc": sortOption = { name: 1 }; break;
                case "name_desc": sortOption = { name: -1 }; break;
                case "newest": sortOption = { createdAt: -1 }; break;
                case "oldest": sortOption = { createdAt: 1 }; break;
            }
        }

        const total = await productRepository.countProducts(query);
        const products = await productRepository.findProducts(query, sortOption, page, limit);
        const data = products.map((p: any) => p.toObject ? p.toObject() : p);

        return {
            data,
            metadata: paginationMetadata(total, page, limit),
        };
    }

    async getProductById(id: string) {
        const product = await productRepository.getProductById(id);
        if (!product) {
            throw new HttpError(404, "Product not found");
        }
        const obj: any = product.toObject ? product.toObject() : product;
        return obj;
    }

    async getRelatedProducts(productId: string, limit: number = 4) {
        const product = await productRepository.getProductById(productId);
        if (!product) {
            throw new HttpError(404, "Product not found");
        }
        const query = {
            _id: { $ne: product._id },
            category: product.category,
        };
        const products = await productRepository.findProducts(query, { createdAt: -1 }, 1, limit);
        return products.map((p: any) => p.toObject ? p.toObject() : p);
    }

    async updateProduct(id: string, data: UpdateProductDTO) {
        if (data.name) {
            const existing = await productRepository.getProductByName(data.name);
            if (existing && String(existing._id) !== id) {
                throw new HttpError(409, "A product with this name already exists");
            }
        }
        const updated = await productRepository.updateProduct(id, data);
        if (!updated) {
            throw new HttpError(404, "Product not found");
        }
        const obj: any = updated.toObject ? updated.toObject() : updated;
        return obj;
    }

    async deleteProduct(id: string) {
        const deleted = await productRepository.deleteProduct(id);
        if (!deleted) {
            throw new HttpError(404, "Product not found");
        }
        return true;
    }
}
