import { HttpError } from "../errors/http-error";
import { AddressRepository } from "../repositories/address.repository";

const addressRepository = new AddressRepository();

export class AddressService {
    async listAddresses(userId: string) {
        return addressRepository.findByUserId(userId);
    }

    async getAddressById(userId: string, addressId: string) {
        const address = await addressRepository.findById(addressId);
        if (!address || String(address.userId) !== userId) {
            throw new HttpError(404, "Address not found");
        }
        return address;
    }

    async createAddress(userId: string, data: any) {
        if (data.isDefault) {
            await addressRepository.unsetDefaultForUser(userId);
        }
        return addressRepository.create({ ...data, userId });
    }

    async updateAddress(userId: string, addressId: string, data: any) {
        const existing = await addressRepository.findById(addressId);
        if (!existing || String(existing.userId) !== userId) {
            throw new HttpError(404, "Address not found");
        }
        if (data.isDefault) {
            await addressRepository.unsetDefaultForUser(userId);
        }
        const updated = await addressRepository.update(addressId, data);
        if (!updated) {
            throw new HttpError(404, "Address not found");
        }
        return updated;
    }

    async deleteAddress(userId: string, addressId: string) {
        const existing = await addressRepository.findById(addressId);
        if (!existing || String(existing.userId) !== userId) {
            throw new HttpError(404, "Address not found");
        }
        return addressRepository.delete(addressId);
    }
}

