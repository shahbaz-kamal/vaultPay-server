import { WalletServices } from "./wallet.service";

import { IWallet } from "./wallet.interface";

export const createWallet = (payload: Partial<IWallet>) => {
  const wallet = WalletServices.createWallet(payload);
  return wallet;
};
