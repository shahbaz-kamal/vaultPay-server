import { User } from "./../user/user.model";
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import {
  calculateCashOutCharge,
  calculateSendMoney,
} from "../../utils/calculateTransactionFee";
import { generateTransactionId } from "../../utils/generateTransactionId";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import {
  ITransaction,
  TRANSACTION_SOURCE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { System } from "../system/system.model";

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
  const session = await Transaction.startSession();
  session.startTransaction();
  try {
    // checking sender verification
    const isSenderExist = await User.findOne({ email: payload.senderEmail });

    if (!isSenderExist) throw new AppError(401, "User does not exist");
    if (!isSenderExist.isVerified)
      throw new AppError(401, "Please verify your account to send money");
    if (isSenderExist.isDeleted) throw new AppError(401, "You are deleted");

    //checking reciever verificTION
    const isReceiverExist = await User.findOne({
      email: payload.receiverEmail,
    });
    if (!isReceiverExist) throw new AppError(401, "Receiver does not exist");
    if (!isReceiverExist.isVerified)
      throw new AppError(401, "Receiver is not verified");
    if (isReceiverExist.isDeleted)
      throw new AppError(401, "Receiver is deleted");

    const transactionId = generateTransactionId();
    const transactionType = TRANSACTION_TYPE.SEND_MONEY;
    const transactionSource = TRANSACTION_SOURCE.USER;
    const transactionStatus = TRANSACTION_STATUS.PENDING;
    const transactionFee = await calculateSendMoney();

    payload.transactionId = transactionId;
    payload.type = transactionType;
    payload.source = transactionSource;
    payload.transactionFee = transactionFee;
    if (typeof transactionFee !== "number" || isNaN(transactionFee)) {
      throw new AppError(500, "Transaction fee could not be calculated");
    }
    payload.status = transactionStatus;
    payload.senderId = isSenderExist._id;
    payload.receiverId = isReceiverExist._id;
    const transaction = await Transaction.create([payload], { session });

    const amount = Number(payload.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new AppError(400, "Invalid amount");
    }

    const senderWallet = await Wallet.findById(isSenderExist.wallet, null, {
      session,
    });
    const receiverWallet = await Wallet.findById(isReceiverExist.wallet, null, {
      session,
    });
    if (senderWallet?.balance == null) {
      throw new AppError(500, "Sender wallet not found or has no balance");
    }

    if (receiverWallet?.balance == null) {
      throw new AppError(500, "Receiver wallet not found or has no balance");
    }
    //updating wallets of sender and receiver
    if ((senderWallet?.balance as number) < amount + transactionFee) {
      throw new AppError(401, "Insufficient Balance");
    }

    const newWalletBalanceOfSender =
      (senderWallet?.balance as number) - (amount + transactionFee);

    await Wallet.findByIdAndUpdate(
      isSenderExist.wallet,
      {
        balance: newWalletBalanceOfSender,
      },
      { session }
    );
    const newWalletBalanceOfReceiver =
      (receiverWallet?.balance as number) + amount;

    await Wallet.findByIdAndUpdate(
      isReceiverExist.wallet,
      {
        balance: newWalletBalanceOfReceiver,
      },
      { session }
    );

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transaction[0]._id,
      { status: TRANSACTION_STATUS.COMPLETED },
      { runValidators: true, new: true, session }
    );
    await session.commitTransaction();
    session.endSession();

    console.log("from add Money\n", payload);
    return updatedTransaction;
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw new AppError(401, error.message);
  }
};
const cashOut = async (payload: Partial<ITransaction>) => {
  const session = await Transaction.startSession();
  session.startTransaction();
  try {
    // checking sender verification
    const isSenderExist = await User.findOne({ email: payload.senderEmail });

    if (!isSenderExist) throw new AppError(401, "User does not exist");
    if (!isSenderExist.isVerified)
      throw new AppError(401, "Please verify your account to send money");
    if (isSenderExist.isDeleted) throw new AppError(401, "You are deleted");

    //checking reciever verificTION
    const isReceiverExist = await User.findOne({
      email: payload.receiverEmail,
    });
    if (!(isReceiverExist?.role === Role.AGENT))
      throw new AppError(401, "Receiver must be an agent");
    if (!isReceiverExist) throw new AppError(401, "Receiver does not exist");
    if (!isReceiverExist.isVerified)
      throw new AppError(401, "Receiver is not verified");
    if (isReceiverExist.isDeleted)
      throw new AppError(401, "Receiver is deleted");

    const transactionId = generateTransactionId();
    const transactionType = TRANSACTION_TYPE.CASH_OUT;
    const transactionSource = TRANSACTION_SOURCE.USER;
    const transactionStatus = TRANSACTION_STATUS.PENDING;
    const { sendMoneyCharge, agentCommission, systemProfit } =
      await calculateCashOutCharge(payload.amount as number);

    payload.transactionId = transactionId;
    payload.type = transactionType;
    payload.source = transactionSource;
    payload.transactionFee = sendMoneyCharge;
    // if (typeof transactionFee !== "number" || isNaN(transactionFee)) {
    //   throw new AppError(500, "Transaction fee could not be calculated");
    // }
    payload.status = transactionStatus;
    payload.senderId = isSenderExist._id;
    payload.receiverId = isReceiverExist._id;
    payload.agentCommission = agentCommission;
    const transaction = await Transaction.create([payload], { session });

    const amount = Number(payload.amount);
    // if (isNaN(amount) || amount <= 0) {
    //   throw new AppError(400, "Invalid amount");
    // }

    const senderWallet = await Wallet.findById(isSenderExist.wallet, null, {
      session,
    });
    const receiverWallet = await Wallet.findById(isReceiverExist.wallet, null, {
      session,
    });
    if (senderWallet?.balance == null) {
      throw new AppError(500, "Sender wallet not found or has no balance");
    }

    if (receiverWallet?.balance == null) {
      throw new AppError(500, "Receiver wallet not found or has no balance");
    }
    //updating wallets of sender and receiver
    if ((senderWallet?.balance as number) < amount + sendMoneyCharge) {
      throw new AppError(401, "Insufficient Balance");
    }

    const newWalletBalanceOfSender =
      (senderWallet?.balance as number) - (amount + sendMoneyCharge);

    await Wallet.findByIdAndUpdate(
      isSenderExist.wallet,
      {
        balance: newWalletBalanceOfSender,
      },
      { session }
    );
    const newWalletBalanceOfReceiver =
      (receiverWallet?.balance as number) + amount + agentCommission;

    await Wallet.findByIdAndUpdate(
      isReceiverExist.wallet,
      {
        balance: newWalletBalanceOfReceiver,
      },
      { session }
    );

    //updating system balance
    const system = await System.findOne({}, null, { session });

    const currentSystemBalance = system?.balance as number;
    const newSystemBalance = currentSystemBalance + systemProfit;
    await System.findByIdAndUpdate(
      system?._id,
      { balance: newSystemBalance },
      { session }
    );
    const newTransaction = await Transaction.findByIdAndUpdate(
      transaction[0]._id,
      {
        status: TRANSACTION_STATUS.COMPLETED,
      },
      { runValidators: true, new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

  
    return newTransaction;
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw new AppError(401, error.message);
  }
};

export const TransactionService = { addMoney, sendMoney,cashOut };
