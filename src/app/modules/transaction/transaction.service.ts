import AppError from "../../errorHelpers/AppError";
import { calculateSendMoney } from "../../utils/calculateTransactionFee";
import { generateTransactionId } from "../../utils/generateTransactionId";
import { User } from "../user/user.model";
import {
  ITransaction,
  TRANSACTION_SOURCE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "./transaction.interface";

const addMoney = async () => {
  console.log("addmoney");
};
// export interface ITransaction {
//   _id: Types.ObjectId;
//   transactionId: string; // Unique reference (e.g., "TXN123456")
//   type: TRANSACTION_TYPE;
//   source: TRANSACTION_SOURCE; // Who initiated the transaction
//   from?: Types.ObjectId;
//   to?: Types.ObjectId;
//   amount: number;
//   transactionFee?: number;
//   commission?: number; // Agent commission
//   status: TRANSACTION_STATUS;
//   notes?: string;
//   createdAt: Date;
//   completedAt?: Date;
// }
const sendMoney = async (payload: Partial<ITransaction>) => {
  // checking sender verification
  const isSenderExist = await User.findOne({ email: payload.from });

  if (!isSenderExist) throw new AppError(401, "User does not exist");
  if (!isSenderExist.isVerified)
    throw new AppError(401, "Please verify your account to send money");
  if (isSenderExist.isDeleted) throw new AppError(401, "You are deleted");

  //checking reciever verificTION
  const isReceiverExist = await User.findOne({ email: payload.to });
  if (!isReceiverExist) throw new AppError(401, "Receiver does not exist");
  if (!isReceiverExist.isVerified)
    throw new AppError(401, "Receiver is not verified");
  if (isReceiverExist.isDeleted)
    throw new AppError(401, "Receiver is deleted");

  const transactionId = generateTransactionId();
  const transactionType = TRANSACTION_TYPE.SEND_MONEY;
  const transactionSource = TRANSACTION_SOURCE.USER;
  const transactionStatus=TRANSACTION_STATUS.PENDING

  calculateSendMoney(payload.amount as number);

  payload.transactionId = transactionId;
  payload.type = transactionType;
  payload.source = transactionSource;
  payload.status = transactionStatus;


  console.log("from add Money\n", payload);
  return payload
};

export const TransactionService = { addMoney, sendMoney };
