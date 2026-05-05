import { prisma } from "../../lib/prisma.js";
import { IAddressRepository } from "./address.interface.js";
import { createAddressDTO, updateAddressDTO } from "./address.schema.js";

export class AddressRepository implements IAddressRepository {
  async createAddress(data: createAddressDTO, userId: string) {
    const createdAddress = await prisma.address.create({
      data: {
        userId,
        ...data,
      },
    });

    return createdAddress;
  }

  async getAddressesByUserId(userId: string) {
    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
    });

    return addresses;
  }

  async getAddressByUserIdAndAddressId(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    return address;
  }

  async updateAddress(addressId: string, data: updateAddressDTO) {
    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
      },
      data,
    });

    return updatedAddress;
  }

  async deleteAddress(addressId: string) {
    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });
  }
}
