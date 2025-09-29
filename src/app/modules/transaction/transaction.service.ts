import { Query } from "mongoose";
import { User } from "./../user/user.model";
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import {
  calculateCashInCharge,
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
import { ISSLCommerze } from "../sslCommerz/sslCommerze.interface";
import { SSLService } from "../sslCommerz/sslCommerze.service";
import { success } from "zod";

const addMoney = async (payload: Partial<ITransaction>) => {
  const session = await Transaction.startSession();
  session.startTransaction();
  try {
    // checking sender verification

    //checking reciever verificTION
    const isReceiverExist = await User.findOne({
      email: payload.receiverEmail,
    });
    if (!isReceiverExist)
      throw new AppError(
        401,
        "Your profile has not been found. please contact our Call center"
      );
    if (!isReceiverExist.isVerified)
      throw new AppError(401, "You are not verified");
    if (isReceiverExist.isDeleted)
      throw new AppError(401, "Receiver is deleted");
    if (!isReceiverExist.address)
      throw new AppError(
        401,
        "Address should be updated in your profile to initialize add money"
      );
    if (!isReceiverExist.phone)
      throw new AppError(
        401,
        "Phone number should be updated in your profile to initialize add money"
      );

    const transactionId = generateTransactionId();
    const transactionType = TRANSACTION_TYPE.ADD_MONEY;
    const transactionSource = TRANSACTION_SOURCE.SSLCOMMERZ;
    const transactionStatus = TRANSACTION_STATUS.PENDING;
    // const transactionFee = await calculateSendMoney();

    payload.transactionId = transactionId;
    payload.type = transactionType;
    payload.source = transactionSource;
    payload.status = transactionStatus;
    payload.receiverId = isReceiverExist._id;

    const transaction = await Transaction.create([payload], { session });

    const amount = Number(payload.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new AppError(400, "Invalid amount");
    }

    //ssl commerze integration
    const sslPayload: ISSLCommerze = {
      transactionId,
      name: isReceiverExist.name,
      email: isReceiverExist.email,
      amount,
      address: isReceiverExist.address,
      phoneNumber: isReceiverExist.phone,
    };
    const sslPayment = await SSLService.sslAddMoneyInit(sslPayload);
    // const receiverWallet = await Wallet.findById(isReceiverExist.wallet, null, {
    //   session,
    // });

    // if (!receiverWallet) {
    //   throw new AppError(500, "Receiver wallet not found ");
    // }
    // //updating wallets of sender and receiver
    // const newWalletBalanceOfReceiver =
    //   (receiverWallet?.balance as number) + amount;

    // await Wallet.findByIdAndUpdate(
    //   isReceiverExist.wallet,
    //   {
    //     balance: newWalletBalanceOfReceiver,
    //   },
    //   { session }
    // );

    // const updatedTransaction = await Transaction.findByIdAndUpdate(
    //   transaction[0]._id,
    //   { status: TRANSACTION_STATUS.COMPLETED },
    //   { runValidators: true, new: true, session }
    // );
    await session.commitTransaction();
    session.endSession();

    console.log("from add Money\n", payload);
    return { paymeent: sslPayment.GatewayPageURL, result: transaction };
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw new AppError(401, error.message);
  }
};

const addMoneySuccess = async (query: Record<string, string>) => {
  const session = await Transaction.startSession();
  session.startTransaction();
  try {
    //updating transaction wallet
    const updatedTransaction = await Transaction.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      {
        status: TRANSACTION_STATUS.COMPLETED,
      },
      { new: true, runValidators: true, session }
    );
    if (!updatedTransaction) {
      throw new AppError(404, "Transaction not found");
    }

    //get reciever
    const isReceiverExist = await User.findById(updatedTransaction.receiverId);

    if (!isReceiverExist) throw new AppError(401, "User does not exist");

    //updating receiver wallet balance

    const receiverWallet = await Wallet.findOne(
      { _id: isReceiverExist.wallet },
      null,
      { session }
    );

    if (!receiverWallet) {
      throw new AppError(404, "Receiver wallet not found");
    }

    const newBalance =
      Number(receiverWallet.balance) + Number(updatedTransaction.amount);

    const updatedWallet = await Transaction.findByIdAndUpdate(
      {
        _id: updatedTransaction._id,
      },
      {
        balance: newBalance,
      },
      { new: true, runValidators: true, session }
    );
    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Payment Completed successfully" };
  } catch (error) {
    console.log(error);
    session.abortTransaction();
    session.endSession();
  }
};

const addMoneyFail = async (query: Record<string, string>) => {
  try {
    //updating transaction wallet
    const updatedTransaction = await Transaction.findOneAndDelete({
      transactionId: query.transactionId,
    });
    if (!updatedTransaction) {
      throw new AppError(404, "Transaction not found");
    }

    //get reciever

    return { success: false, message: "Payment failed" };
  } catch (error) {
    console.log(error);
  }
};

const addMoneyCancel = async (query: Record<string, string>) => {
  try {
    //updating transaction wallet
    const updatedTransaction = await Transaction.findOneAndDelete({
      transactionId: query.transactionId,
    });
    if (!updatedTransaction) {
      throw new AppError(404, "Transaction not found");
    }

    //get reciever

    return { success: false, message: "Payment Cancelled" };
  } catch (error) {
    console.log(error);
  }
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
    throw new AppError(401, error);
  }
};

const cashIn = async (payload: Partial<ITransaction>) => {
  const session = await Transaction.startSession();
  session.startTransaction();
  try {
    // checking sender verification
    const isSenderExist = await User.findOne({ email: payload.senderEmail });

    if (!isSenderExist) throw new AppError(401, "Sender does not exist");
    if (!(isSenderExist?.role === Role.AGENT))
      throw new AppError(401, "Sender must be an agent");

    if (!isSenderExist.isVerified)
      throw new AppError(401, "Please verify your account to send money");
    if (isSenderExist.isDeleted) throw new AppError(401, "You are deleted");

    //checking reciever verificTION
    const isReceiverExist = await User.findOne({
      email: payload.receiverEmail,
    });

    if (!isReceiverExist) throw new AppError(401, "Receiver does not exist");
    if (!(isReceiverExist?.role === Role.USER))
      throw new AppError(401, "Receiver must be a user");
    if (!isReceiverExist.isVerified)
      throw new AppError(401, "Receiver is not verified");
    if (isReceiverExist.isDeleted)
      throw new AppError(401, "Receiver is deleted");

    const transactionId = generateTransactionId();
    const transactionType = TRANSACTION_TYPE.CASH_IN;
    const transactionSource = TRANSACTION_SOURCE.AGENT;
    const transactionStatus = TRANSACTION_STATUS.PENDING;
    const transactionFee = await calculateCashInCharge();

    payload.transactionId = transactionId;
    payload.type = transactionType;
    payload.source = transactionSource;
    payload.transactionFee = transactionFee;
    // if (typeof transactionFee !== "number" || isNaN(transactionFee)) {
    //   throw new AppError(500, "Transaction fee could not be calculated");
    // }
    payload.status = transactionStatus;
    payload.senderId = isSenderExist._id;
    payload.receiverId = isReceiverExist._id;
    // payload.agentCommission = agentCommission;
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

    //updating system balance
    // const system = await System.findOne({}, null, { session });

    // const currentSystemBalance = system?.balance as number;
    // const newSystemBalance = currentSystemBalance + systemProfit;
    // await System.findByIdAndUpdate(
    //   system?._id,
    //   { balance: newSystemBalance },
    //   { session }
    // );
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

export const TransactionService = {
  addMoney,
  addMoneySuccess,
  addMoneyFail,
  addMoneyCancel,
  sendMoney,
  cashOut,
  cashIn,
};
