import Address, { IAddress } from "../models/Address";
import { CreateAddressDTO } from "../dto/address.dto";

export const findOneAddress = async (query: any): Promise<IAddress | null> => {
  const address = await Address.findOne({ ...query }).populate(
    "user",
    "firstname lastname email"
  );

  return address;
};

export const addAddressDB = async (
  data: CreateAddressDTO
): Promise<IAddress> => {
  let address = new Address(data);

  address = await address.save();

  return address;
};

export const getAddressesDB = async (): Promise<IAddress[]> => {
  const addresses = await Address.find().populate(
    "user",
    "firstname lastname email"
  );

  return addresses;
};


export const getUserAddressesDB = async (userId: string): Promise<IAddress[]> => {
  const addresses = await Address.find({ user: userId }).populate(
    "user",
    "firstname lastname email"
  );

  return addresses;
};


export const updateAddressDB = async (address: IAddress): Promise<IAddress> => {
  const updatedAddress = await address.save();

  return updatedAddress;
};

export const deleteAddressDB = async (address: IAddress): Promise<IAddress> => {
  const deletedAddress = await address.remove();

  return deletedAddress;
};
