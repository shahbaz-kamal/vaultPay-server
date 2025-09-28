import { Types } from "mongoose";

export enum TRANSACTION_TYPE {
  ADD_MONEY = "ADD_MONEY", ////bank to user
  SEND_MONEY = "SEND_MONEY", //// user to user
  CASH_IN = "CASH_IN", ////agents to user
  CASH_OUT = "CASH_OUT", ////users to agent
}
export enum TRANSACTION_STATUS {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCEllED",
}
export enum TRANSACTION_SOURCE {
  BANK = "BANK",
  SSLCOMMERZ = "SSLCOMMERZ",
  USER = "USER",
  AGENT = "AGENT",
  SYSTEM = "SYSTEM",
}
export interface ITransaction {
  _id: Types.ObjectId;
  transactionId: string; // Unique reference (e.g., "TXN123456")
  type: TRANSACTION_TYPE;
  source: TRANSACTION_SOURCE; // Who initiated the transaction
  from?: string | null;
  to?: string | null;
  amount: number;
  transactionFee?: number;
  agentCommission?: number |null; // Agent commission
  status: TRANSACTION_STATUS;
  notes?: string;
  createdAt: Date;
  completedAt?: Date;
}
