import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";

const createWallet = async (newWallet: Partial<IWallet>) => {
  const wallet = await Wallet.insertOne(newWallet);
  return wallet;
};

export const WalletServices = { createWallet };
