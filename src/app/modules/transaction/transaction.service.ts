
/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "./../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { calculateCashInCharge, calculateCashOutCharge, calculateSendMoney } from "../../utils/calculateTransactionFee";
import { generateTransactionId } from "../../utils/generateTransactionId";
import { Role } from "../user/user.interface";

import { Wallet } from "../wallet/wallet.model";
import { ITransaction, TRANSACTION_SOURCE, TRANSACTION_STATUS, TRANSACTION_TYPE } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { System } from "../system/system.model";
import { ISSLCommerze } from "../sslCommerz/sslCommerze.interface";
import { SSLService } from "../sslCommerz/sslCommerze.service";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { searchableFields } from "../../constants";
import { JwtPayload } from "jsonwebtoken";

import { generateInvoiceId } from "../../utils/generateInvoiceId";

import { handleInvoiceSendAndUpload } from "../../utils/handleInvoiceSendAndUpload";
import { IInvoiceData } from "../../utils/invoice";
import httpStatus from 'http-status-codes'

const addMoney = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
  const session = await Transaction.startSession();
  session.startTransaction();
  try {
    // checking sender verification

    //checking reciever verificTION
    const isReceiverExist = await User.findOne({
      email: payload.receiverEmail,
    });

    if (decodedToken.role !== isReceiverExist?.role) throw new AppError(401, "You are not authorized");

    if (!isReceiverExist) throw new AppError(401, "Your profile has not been found. please contact our Call center");
    if (!isReceiverExist.isVerified) throw new AppError(401, "You are not verified");
    if (isReceiverExist.isDeleted) throw new AppError(401, "Receiver is deleted");
    // if (!isReceiverExist.address)
    //   throw new AppError(401, "Address should be updated in your profile through update user route to initialize add money");
    // if (!isReceiverExist.phone)
    //   throw new AppError(401, "Phone number should be updated in your profile through update user route to initialize add money");

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

    await session.commitTransaction();
    session.endSession();

    console.log("from add Money\n", payload);
    return { payment: sslPayment.GatewayPageURL, result: transaction };
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
    let updatedTransaction = await Transaction.findOneAndUpdate(
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

    const receiverWallet = await Wallet.findOne({ _id: isReceiverExist.wallet }, null, { session });

    if (!receiverWallet) {
      throw new AppError(404, "Receiver wallet not found");
    }

    const newBalance = Number(receiverWallet.balance) + Number(updatedTransaction.amount);

    await Wallet.findOneAndUpdate(
      {
        _id: receiverWallet._id,
      },
      {
        balance: newBalance,
      },
      { new: true, runValidators: true, session }
    );

    const invoiceData: IInvoiceData = {
      invoiceId: generateInvoiceId(),
      transactionId: updatedTransaction.transactionId,
      senderName: "SSLCommerze",
      senderEmail: "",
      transactionDate: updatedTransaction.createdAt as Date,
      receiverName: isReceiverExist.name,
      receiverEmail: isReceiverExist.email,
      transactionType: "Add Money",
      totalAmount: Number(updatedTransaction.amount),
      status: updatedTransaction.status,
      notes: updatedTransaction.notes || "",
    };

    // this return {success: true, invoiceUrl: cloudinaryResult.secure_url};
    // invoice is uploaded and saved to cloudinary

    const handleInvoiceResult = await handleInvoiceSendAndUpload(invoiceData, 1);

    updatedTransaction = await Transaction.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      {
        invoiceUrl: handleInvoiceResult.invoiceUrl,
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
    try {
      await Transaction.findOneAndDelete({ transactionId: query.transactionId });
    } catch (deleteError) {
      console.error("Failed to delete transaction after rollback", deleteError);
      // You might alert or log further here
    }
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

const sendMoney = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
  const session = await Transaction.startSession();
  session.startTransaction();
  try {
    // checking sender verification
    const isSenderExist = await User.findOne({ email: payload.senderEmail });
    if (decodedToken.role !== isSenderExist?.role) throw new AppError(401, "You are not authorized");

    if (!isSenderExist) throw new AppError(401, "User does not exist");
    if (!isSenderExist.isVerified) throw new AppError(401, "Please verify your account to send money");
    if (isSenderExist.isDeleted) throw new AppError(401, "You are deleted");
    if (isSenderExist.role !== Role.USER) throw new AppError(401, "Only Users can initiate send money");
    if (isSenderExist.role !== Role.USER) throw new AppError(401, "Only Users can initiate send money");

    //checking reciever verificTION
    const isReceiverExist = await User.findOne({
      email: payload.receiverEmail,
    });
    if (!isReceiverExist) throw new AppError(401, "Receiver does not exist");
    if (isReceiverExist.role !== Role.USER) throw new AppError(401, "Receiver must be User");
    if (!isReceiverExist.isVerified) throw new AppError(401, "Receiver is not verified");
    if (isReceiverExist.isDeleted) throw new AppError(401, "Receiver is deleted");
    if (isSenderExist.role !== Role.USER) throw new AppError(401, "Only Users can receive send money");
    const transactionId = generateTransactionId();
    const transactionType = TRANSACTION_TYPE.SEND_MONEY;
    const transactionSource = TRANSACTION_SOURCE.USER;
    const transactionStatus = TRANSACTION_STATUS.PENDING;
    const transactionFee = await calculateSendMoney();



    // Updating systrem balance. for send money.


    const system = await System.findOne({}, null, { session });

    const currentSystemBalance = system?.balance as number;
    const newSystemBalance = currentSystemBalance + transactionFee;
 

    await System.findByIdAndUpdate(system?._id, { balance: newSystemBalance}, { session });

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

    const newWalletBalanceOfSender = (senderWallet?.balance as number) - (amount + transactionFee);

    await Wallet.findByIdAndUpdate(
      isSenderExist.wallet,
      {
        balance: newWalletBalanceOfSender,
      },
      { session }
    );
    const newWalletBalanceOfReceiver = (receiverWallet?.balance as number) + amount;

    await Wallet.findByIdAndUpdate(
      isReceiverExist.wallet,
      {
        balance: newWalletBalanceOfReceiver,
      },
      { session }
    );

    let updatedTransaction = await Transaction.findByIdAndUpdate(
      transaction[0]._id,
      { status: TRANSACTION_STATUS.COMPLETED },
      { runValidators: true, new: true, session }
    );
    if (!updatedTransaction) throw new AppError(401, "Transaction not found");
    const invoiceData: IInvoiceData = {
      invoiceId: generateInvoiceId(),
      transactionId: updatedTransaction.transactionId,
      senderName: isSenderExist.name,
      senderEmail: isSenderExist.email,
      transactionDate: updatedTransaction.createdAt as Date,
      receiverName: isReceiverExist.name,
      receiverEmail: isReceiverExist.email,
      transactionType: "Send Money",
      totalAmount: Number(updatedTransaction.amount),
      status: updatedTransaction.status,
      notes: updatedTransaction.notes || "",
    };

    // this return {success: true, invoiceUrl: cloudinaryResult.secure_url};
    // invoice is uploaded and saved to cloudinary

    const handleInvoiceResult = await handleInvoiceSendAndUpload(invoiceData, 2);

    updatedTransaction = await Transaction.findOneAndUpdate(
      {
        transactionId: updatedTransaction.transactionId,
      },
      {
        invoiceUrl: handleInvoiceResult.invoiceUrl,
      },
      { new: true, runValidators: true, session }
    );

    // return { success: true, message: "Payment Completed successfully" };

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

const cashOut = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
  const session = await Transaction.startSession();
  session.startTransaction();
  try {
    // checking sender verification
    const isSenderExist = await User.findOne({ email: payload.senderEmail });

    if (decodedToken.role !== isSenderExist?.role) throw new AppError(401, "You are not authorized");
    if (!isSenderExist) throw new AppError(401, "User does not exist");
    if (!isSenderExist.isVerified) throw new AppError(401, "Please verify your account to send money");
    if (isSenderExist.isDeleted) throw new AppError(401, "You are deleted");
    if (isSenderExist.role !== Role.USER) throw new AppError(401, "Sender must be a user");

    //checking reciever verificTION
    const isReceiverExist = await User.findOne({
      email: payload.receiverEmail,
    });
    if (!(isReceiverExist?.role === Role.AGENT)) throw new AppError(401, "Receiver must be an agent");
    if (!isReceiverExist) throw new AppError(401, "Receiver does not exist");
    if (!isReceiverExist.isVerified) throw new AppError(401, "Receiver is not verified");
    if (isReceiverExist.isDeleted) throw new AppError(401, "Receiver is deleted");

    const transactionId = generateTransactionId();
    const transactionType = TRANSACTION_TYPE.CASH_OUT;
    const transactionSource = TRANSACTION_SOURCE.USER;
    const transactionStatus = TRANSACTION_STATUS.PENDING;
    const { cashOutCharge, agentCommission, systemProfit } = await calculateCashOutCharge(payload.amount as number);
    console.log({ cashOutCharge, agentCommission, systemProfit });

    payload.transactionId = transactionId;
    payload.type = transactionType;
    payload.source = transactionSource;
    payload.transactionFee = cashOutCharge;
    // if (typeof transactionFee !== "number" || isNaN(transactionFee)) {
    //   throw new AppError(500, "Transaction fee could not be calculated");
    // }
    payload.status = transactionStatus;
    payload.senderId = isSenderExist._id;
    payload.receiverId = isReceiverExist._id;
    payload.agentCommission = agentCommission;

    const transaction = await Transaction.create([payload], { session });

    const amount = Number(payload.amount);
  

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
    if ((senderWallet?.balance as number) < amount + cashOutCharge) {
      throw new AppError(401, "Insufficient Balance");
    }

    const newWalletBalanceOfSender = (senderWallet?.balance as number) - (amount + cashOutCharge);

    await Wallet.findByIdAndUpdate(
      isSenderExist.wallet,
      {
        balance: newWalletBalanceOfSender,
      },
      { session }
    );
    const newWalletBalanceOfReceiver = (receiverWallet?.balance as number) + amount + agentCommission;

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
    let newAgentComimissionPayout;
    if (system?.agentComimissionPayout) {
      newAgentComimissionPayout = (system?.agentComimissionPayout as number) + agentCommission;
    } else {
      newAgentComimissionPayout = agentCommission;
    }

    await System.findByIdAndUpdate(system?._id, { balance: newSystemBalance, agentComimissionPayout:newAgentComimissionPayout }, { session });
    let updatedTransaction = await Transaction.findByIdAndUpdate(
      transaction[0]._id,
      {
        status: TRANSACTION_STATUS.COMPLETED,
      },
      { runValidators: true, new: true, session }
    );
    if (!updatedTransaction) throw new AppError(401, "Transaction not found");

    const invoiceData: IInvoiceData = {
      invoiceId: generateInvoiceId(),
      transactionId: updatedTransaction.transactionId,
      senderName: isSenderExist.name,
      senderEmail: isSenderExist.email,
      transactionDate: updatedTransaction.createdAt as Date,
      receiverName: isReceiverExist.name,
      receiverEmail: isReceiverExist.email,
      transactionType: "Cash Out",
      totalAmount: Number(updatedTransaction.amount),
      status: updatedTransaction.status,
      notes: updatedTransaction.notes || "",
    };

    // this return {success: true, invoiceUrl: cloudinaryResult.secure_url};
    // invoice is uploaded and saved to cloudinary

    const handleInvoiceResult = await handleInvoiceSendAndUpload(invoiceData, 2);

    updatedTransaction = await Transaction.findOneAndUpdate(
      {
        transactionId: updatedTransaction.transactionId,
      },
      {
        invoiceUrl: handleInvoiceResult.invoiceUrl,
      },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedTransaction;
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
    if (!(isSenderExist?.role === Role.AGENT)) throw new AppError(401, "Sender must be an agent");

    if (!isSenderExist.isVerified) throw new AppError(401, "Please verify your account to send money");
    if (isSenderExist.isDeleted) throw new AppError(401, "You are deleted");

    //checking reciever verificTION
    const isReceiverExist = await User.findOne({
      email: payload.receiverEmail,
    });

    if (!isReceiverExist) throw new AppError(401, "Receiver does not exist");
    if (!(isReceiverExist?.role === Role.USER)) throw new AppError(401, "Receiver must be a user");
    if (!isReceiverExist.isVerified) throw new AppError(401, "Receiver is not verified");
    if (isReceiverExist.isDeleted) throw new AppError(401, "Receiver is deleted");

    const transactionId = generateTransactionId();
    const transactionType = TRANSACTION_TYPE.CASH_IN;
    const transactionSource = TRANSACTION_SOURCE.AGENT;
    const transactionStatus = TRANSACTION_STATUS.PENDING;
    const transactionFee = await calculateCashInCharge();
    console.log("From Transaction Fee", transactionFee);

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

    const transaction = await Transaction.create([payload], { session });

    const amount = Number(payload.amount);

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

    const newWalletBalanceOfSender = (senderWallet?.balance as number) - (amount + transactionFee);

    await Wallet.findByIdAndUpdate(
      isSenderExist.wallet,
      {
        balance: newWalletBalanceOfSender,
      },
      { session }
    );
    const newWalletBalanceOfReceiver = (receiverWallet?.balance as number) + amount;

    await Wallet.findByIdAndUpdate(
      isReceiverExist.wallet,
      {
        balance: newWalletBalanceOfReceiver,
      },
      { session }
    );

    let updatedTransaction = await Transaction.findByIdAndUpdate(
      transaction[0]._id,
      {
        status: TRANSACTION_STATUS.COMPLETED,
      },
      { runValidators: true, new: true, session }
    );

    if (!updatedTransaction) throw new AppError(401, "Transaction not found");

    const invoiceData: IInvoiceData = {
      invoiceId: generateInvoiceId(),
      transactionId: updatedTransaction.transactionId,
      senderName: isSenderExist.name,
      senderEmail: isSenderExist.email,
      transactionDate: updatedTransaction.createdAt as Date,
      receiverName: isReceiverExist.name,
      receiverEmail: isReceiverExist.email,
      transactionType: "Cash In",
      totalAmount: Number(updatedTransaction.amount),
      status: updatedTransaction.status,
      notes: updatedTransaction.notes || "",
    };

    // this return {success: true, invoiceUrl: cloudinaryResult.secure_url};
    // invoice is uploaded and saved to cloudinary

    const handleInvoiceResult = await handleInvoiceSendAndUpload(invoiceData, 2);

    updatedTransaction = await Transaction.findOneAndUpdate(
      {
        transactionId: updatedTransaction.transactionId,
      },
      {
        invoiceUrl: handleInvoiceResult.invoiceUrl,
      },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedTransaction;
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw new AppError(401, error.message);
  }
};

const getAllTransaction = async (query: Record<string, string>) => {
  const modelQuery = new QueryBuilder<ITransaction>(
    Transaction.find().populate("senderId", "name email role isActive").populate("receiverId", "name email role isActive"),
    query
  );
  const transactions = modelQuery.search(searchableFields).filter().sort().fields().pagination();

  const [data, meta] = await Promise.all([transactions.build(), transactions.getMeta()]);

  return { data, meta };
};

const getMyTransactions = async (decodedToken: JwtPayload, query: Record<string, string>) => {
  const myId = decodedToken.userId;
  const  myEmail=decodedToken.email;
  const isMyDataExist = await User.findById(myId);
  if (!isMyDataExist) throw new AppError(401, "Your Data is not found. Please contact our support team.");
  const isVerified = isMyDataExist.role === decodedToken.role;
  if (!isVerified) throw new AppError(401, "User is not verified");
  // const myTransactions=await Transaction.
  const modelQuery = new QueryBuilder<ITransaction>(
    Transaction.find({
      $or: [{ senderId: myId }, { receiverId: myId }],
    })
      .populate("senderId", "name email role isActive")
      .populate("receiverId", "name email role isActive"),
    query
  );

  const myTransactions = modelQuery.dateFiltering().search(searchableFields).sort().fields().pagination();

  const [data, meta] = await Promise.all([myTransactions.build(), myTransactions.getMeta()]);

  // console.log(data.length)
  // console.log(data)

  return { data, meta };
};

const getSingleTransaction=async(transactionId:string)=>{
const transaction=Transaction.findOne({transactionId})
if(!transaction) throw new AppError(httpStatus.NOT_FOUND,"This Transaction dosent Exist")
  return transaction
}
export const TransactionService = {
  addMoney,
  addMoneySuccess,
  addMoneyFail,
  addMoneyCancel,
  sendMoney,
  cashOut,
  cashIn,
  getAllTransaction,
  getMyTransactions,getSingleTransaction
};
