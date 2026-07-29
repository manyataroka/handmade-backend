import { AddressModel, IAddress } from "../models/address.model";

export class AddressRepository {
    async findByUserId(userId: string): Promise<IAddress[]> {
        return AddressModel.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    }

    async findById(id: string): Promise<IAddress | null> {
        return AddressModel.findById(id);
    }

    async create(data: Partial<IAddress>): Promise<IAddress> {
        const address = new AddressModel(data);
        return address.save();
    }

    async update(id: string, data: Partial<IAddress>): Promise<IAddress | null> {
        return AddressModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await AddressModel.findByIdAndDelete(id);
        return result ? true : false;
    }

    async unsetDefaultForUser(userId: string): Promise<void> {
        await AddressModel.updateMany({ userId }, { isDefault: false });
    }
}

