import Address, { IAddress } from "../models/Address";
import { CreateAddressDTO } from "./dto/address.dto";

export const findOneAddress = async (query: any) => {
  const address = await Address.findOne({ ...query }).populate(
    "user",
    "firstname lastname email"
  );

  return address;
};

export const addAddressDB = async (data: CreateAddressDTO) => {
  let address = new Address(data);

  address = await address.save();

  return address;
};

export const getAddressesDB = async (userId: string) => {
  const addresses = await Address.find({ user: userId }).populate(
    "user",
    "firstname lastname email"
  );

  return addresses;
};

export const updateAddressDB = async (address: IAddress) => {
  const updatedAddress = await address.save();

  return updatedAddress;
};

export const deleteAddressDB = async (address: IAddress) => {
  const deletedAddress = await address.remove();

  return deletedAddress;
};
