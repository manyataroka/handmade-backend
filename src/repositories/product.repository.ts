import { ProductModel, IProduct } from "../models/product.model";

export interface IProductRepository {
    createProduct(data: Partial<IProduct>): Promise<IProduct>;
    getProductById(id: string): Promise<IProduct | null>;
    getAllProducts(): Promise<IProduct[]>;
    updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct | null>;
    deleteProduct(id: string): Promise<boolean>;
    getProductByName(name: string): Promise<IProduct | null>;
}

export class ProductRepository implements IProductRepository {
    async createProduct(data: Partial<IProduct>): Promise<IProduct> {
        const product = new ProductModel(data);
        return await product.save();
    }

    async getProductById(id: string): Promise<IProduct | null> {
        return await ProductModel.findById(id);
    }

    async getAllProducts(): Promise<IProduct[]> {
        return await ProductModel.find().sort({ createdAt: -1 });
    }

    async updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
        return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteProduct(id: string): Promise<boolean> {
        const result = await ProductModel.findByIdAndDelete(id);
        return result ? true : false;
    }

    async getProductByName(name: string): Promise<IProduct | null> {
        return await ProductModel.findOne({ name });
    }
}
