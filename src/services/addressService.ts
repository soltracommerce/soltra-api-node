import { IAddress } from "../models/Address";
import ErrorResponse from "./../exceptions/httpException";
import { CreateAddressDTO } from './../repositories/dto/address.dto';
import { NextFunction } from "express";
import {
  addAddressDB,
  findOneAddress,
  updateAddressDB,
  getAddressesDB,
  deleteAddressDB,
} from "../repositories/address";

class AddressService {
  static async addAddress(data: CreateAddressDTO) {
    const address = await addAddressDB(data);

    return address;
  }
  static async getAllAddress(userId: string) {
    const addresses = await getAddressesDB(userId);

    return addresses;
  }
  static async getAddressByID(
    addressId: string,
    userId: string,
    next: NextFunction
  ) {
    const address = await findOneAddress({ _id: addressId, user: userId });

    if (!address) {
      return next(new ErrorResponse(404, "user is yet to register an address"));
    }

    return address;
  }

  static async updateAddress(addressId: string, data: CreateAddressDTO, next: NextFunction) {
    const address = await findOneAddress({ _id: addressId });

    if(!address) {
        return next(new ErrorResponse(404, "address does not exist"));
    }

    if(address.user._id.toString() !== data.user) {
        return next(new ErrorResponse(401, "not authorized to update this address"))
    }

    address.address = data.address;
    address.phoneNumbers = data.phoneNumbers;
    address.additionalInfo = data.additionalInfo;
    address.state = data.state;
    address.city = data.city;
    address.zipcode = data.zipcode;
    address.country = data.country;
    address.isDefault = data.isDefault;

    const updatedAddress = await updateAddressDB(address)

    return updatedAddress;
  }
  
  static async deleteAddress(addressId: string, userId:string, next: NextFunction) {
    const address = await findOneAddress({ _id: addressId });

    if(!address) {
        return next(new ErrorResponse(404, "address does not exist"));
    }

    if(address.user._id.toString() !== userId) {
        return next(new ErrorResponse(401, "not authorized to update this address"))
    }

    const deletedAddress = await deleteAddressDB(address)

    return deletedAddress;
  }
}

export default AddressService;
