import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";

const getAllWallet = async (query: Record<string, string>) => {
  const modelQuery = new QueryBuilder<IWallet>(
    Wallet.find().populate("user", "name email role isActive"),
    query
  );
  const wallets = modelQuery.filter().sort().fields().pagination();

  const [data, meta] = await Promise.all([wallets.build(), wallets.getMeta()]);

  return { data, meta };
};
const updateWallet = async (
  walletId: string,
  payload: Partial<IWallet>,
  decodedToken: JwtPayload
) => {
  const isWalletExist = await Wallet.findById(walletId);

  if (!isWalletExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet Not Found");
  }
  const isUserExist = await User.findById(isWalletExist.user);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet Not Found");
  }

  if (isUserExist.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN)
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");

  const walletStatus = payload.isActive;

  const updatedWallet = await Wallet.findByIdAndUpdate(
    walletId,
    {
      isActive: walletStatus,
    },
    { new: true, runValidators: true }
  );
  return updatedWallet;
};

export const WalletServices = { getAllWallet, updateWallet };
