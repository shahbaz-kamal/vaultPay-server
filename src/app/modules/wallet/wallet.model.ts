import { Schema } from "mongoose";
import { IWallet } from "./wallet.interface";

export const walletSchema = new Schema<IWallet>({
  balance: { type: Number, required: true },
});
