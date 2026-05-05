import { AddressRepository } from "./address.repository.js";
import { AddressService } from "./address.service.js";

const addressRepository = new AddressRepository();
const addressService = new AddressService(addressRepository);

export { addressService };
