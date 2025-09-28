import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";
import { IsActive } from "../user/user.interface";

const walletSchema = new Schema<IWallet>(
  {
    user: { type: Schema.Types.ObjectId, required: true,ref:"User" },
    balance: { type: Number, default: 50 },
    isActive: {
      type: String,
      required: true,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
