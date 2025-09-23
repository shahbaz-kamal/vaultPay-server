import { IsActive } from "./../user/user.interface";
import { Types } from "mongoose";

export interface IWallet {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  balance?: number;
  isActive?: IsActive;
}
