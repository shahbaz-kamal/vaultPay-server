import { model, Schema } from "mongoose";
import { ISystem, ISystemCharges } from "./system.interface";
import { TRANSACTION_TYPE } from "../transaction/transaction.interface";

const systemChargesSchema = new Schema<ISystemCharges>(
  {
    type: { type: String, enum: Object.values(TRANSACTION_TYPE) },
    charge: { type: Number },
    perAmountTransaction: { type: Number, default: null },
    agentCommission: { type: Number, default: null },
  },
  { _id: false, versionKey: false, timestamps: false }
);

const systemSchema = new Schema<ISystem>(
  {
    balance: { type: Number, required: true, default: 0 },
    systemCharges: { type: [systemChargesSchema] },
  },
  { versionKey: false, timestamps: true }
);
export const System = model<ISystem>("System", systemSchema);
