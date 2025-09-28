import { model, Schema } from "mongoose";
import {
  ITransaction,
  TRANSACTION_STATUS,
  TRANSACTION_SOURCE,
  TRANSACTION_TYPE,
} from "./transaction.interface";


const transactionSchema = new Schema<ITransaction>({
  transactionId: { type: String, required: true },
  type: { type: String, required: true, enum: Object.values(TRANSACTION_TYPE) },
  source: {
    type: String,
    required: true,
    enum: Object.values(TRANSACTION_SOURCE),
  },
  from: { type: Schema.Types.ObjectId },
  to: { type: Schema.Types.ObjectId },
  amount: { type: Number },
  transactionFee: { type: Number },
  commission: { type: Number },
  status: { type: String, enum: Object.values(TRANSACTION_STATUS) },
  notes: { type: String },
  completedAt: { type: Date },
});

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
