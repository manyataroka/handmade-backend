import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dto";
import { ProductRepository } from "../repositories/product.repository";
import { HttpError } from "../errors/http-error";

let productRepository = new ProductRepository();

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

    async getAllProducts() {
        const products = await productRepository.getAllProducts();
        return products.map((p: any) => p.toObject ? p.toObject() : p);
    }

    async getProductById(id: string) {
        const product = await productRepository.getProductById(id);
        if (!product) {
            throw new HttpError(404, "Product not found");
        }
        const obj: any = product.toObject ? product.toObject() : product;
        return obj;
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
