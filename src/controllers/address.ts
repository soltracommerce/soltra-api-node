import { Request, Response, NextFunction } from "express";
import AddressService from "./../services/addressService";

export const addAddress = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  req.body.user = req.user.id;

  const address = await AddressService.addAddress(req.body);

  res.status(201).send(address);
};

export const getAllAddress = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const addresses = await AddressService.getAllAddress(req.user.id);

  res.status(200).send(addresses);
};

export const getSingleAddress = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { addressId } = req.params;

  const address = await AddressService.getAddressByID(
    addressId,
    req.user.id,
    next
  );

  if (address) {
    res.status(200).send(address);
  }
};

export const updateAddress = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  req.body.user = req.user.id;

  const { addressId } = req.params;

  const updatedAddress = await AddressService.updateAddress(
    addressId,
    req.body,
    next
  );

  if (updatedAddress) {
    res.status(200).send(updatedAddress);
  }
};

export const deleteAddress = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const { addressId } = req.params;

  const deletedAddress = await AddressService.deleteAddress(addressId, req.user.id, next);

  if(deletedAddress) {
      res.status(200).send(deletedAddress);
  }
};
