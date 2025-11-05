import mongoose, { model, Schema } from "mongoose";
import { ITransaction, TRANSACTION_STATUS, TRANSACTION_SOURCE, TRANSACTION_TYPE } from "./transaction.interface";

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

    status: { type: String, enum: Object.values(TRANSACTION_STATUS) },
    notes: { type: String },
    invoiceUrl: { type: String, default: null },
    completedAt: { type: Date },
    agentCommission:{type:Number ,default:null}
  },
  { timestamps: true, versionKey: false }
);

export const Transaction = model<ITransaction>("Transaction", transactionSchema);
