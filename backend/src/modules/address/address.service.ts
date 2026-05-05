import { AppError } from "../../utils/AppError.js";
import { IAddressRepository } from "./address.interface.js";
import {
  cleanCreateAddressData,
  cleanUpdateAddressData,
} from "./address.request.js";
import { createAddressDTO, updateAddressDTO } from "./address.schema.js";

export class AddressService {
  constructor(private addressRepo: IAddressRepository) {}

  async createAddress(data: createAddressDTO, userId: string) {
    const cleanedData = cleanCreateAddressData(data);

    const createdAddress = this.addressRepo.createAddress(cleanedData, userId);

    return createdAddress;
  }

  async getAddressByUserId(userId: string) {
    const addresses = await this.addressRepo.getAddressesByUserId(userId);

    return addresses;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: updateAddressDTO,
  ) {
    const existingAddress =
      await this.addressRepo.getAddressByUserIdAndAddressId(userId, addressId);

    if (!existingAddress) {
      throw new AppError(
        "Address not found or you are not authorized to perform this action",
        401,
      );
    }

    const cleanedData = cleanUpdateAddressData(data);

    const updatedData = await this.addressRepo.updateAddress(
      addressId,
      cleanedData,
    );

    return updatedData;
  }

  async deleteAddress(userId: string, addressId: string) {
    const existingAddress =
      await this.addressRepo.getAddressByUserIdAndAddressId(userId, addressId);

    if (!existingAddress) {
      throw new AppError(
        "Address not found or you are unauthorized to perform this action.",
        401,
      );
    }

    await this.addressRepo.deleteAddress(addressId);
  }
}
