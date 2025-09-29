import mongoose, { model, Schema } from "mongoose";
import {
  ITransaction,
  TRANSACTION_STATUS,
  TRANSACTION_SOURCE,
  TRANSACTION_TYPE,
} from "./transaction.interface";
import { User } from "../user/user.model";

const transactionSchema = new Schema<ITransaction>(
  {
    transactionId: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(TRANSACTION_TYPE),
    },
    source: {
      type: String,
      required: true,
      enum: Object.values(TRANSACTION_SOURCE),
    },
    senderEmail: { type: String, default: null },
    senderId: { type: mongoose.Types.ObjectId, ref: "User", default: null },
    receiverEmail: { type: String, default: null },
    receiverId: { type: mongoose.Types.ObjectId, ref: "User", default: null },
    amount: { type: Number },
    transactionFee: { type: Number },
    agentCommission: { type: Number, default: null },
    status: { type: String, enum: Object.values(TRANSACTION_STATUS) },
    notes: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
