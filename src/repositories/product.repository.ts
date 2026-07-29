import { ProductModel, IProduct } from "../models/product.model";

export interface IProductRepository {
    createProduct(data: Partial<IProduct>): Promise<IProduct>;
    getProductById(id: string): Promise<IProduct | null>;
    getAllProducts(): Promise<IProduct[]>;
    updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct | null>;
    deleteProduct(id: string): Promise<boolean>;
    getProductByName(name: string): Promise<IProduct | null>;
    countProducts(query: any): Promise<number>;
    findProducts(query: any, sort: any, page: number, limit: number): Promise<IProduct[]>;
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

    async countProducts(query: any): Promise<number> {
        return await ProductModel.countDocuments(query);
    }

    async findProducts(query: any, sort: any, page: number, limit: number): Promise<IProduct[]> {
        const skip = (page - 1) * limit;
        return await ProductModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();
    }
}
