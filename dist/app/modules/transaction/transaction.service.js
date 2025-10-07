"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const user_model_1 = require("./../user/user.model");
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const calculateTransactionFee_1 = require("../../utils/calculateTransactionFee");
const generateTransactionId_1 = require("../../utils/generateTransactionId");
const user_interface_1 = require("../user/user.interface");
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_interface_1 = require("./transaction.interface");
const transaction_model_1 = require("./transaction.model");
const system_model_1 = require("../system/system.model");
const sslCommerze_service_1 = require("../sslCommerz/sslCommerze.service");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const constants_1 = require("../../constants");
const addMoney = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield transaction_model_1.Transaction.startSession();
    session.startTransaction();
    try {
        // checking sender verification
        //checking reciever verificTION
        const isReceiverExist = yield user_model_1.User.findOne({
            email: payload.receiverEmail,
        });
        if (decodedToken.role !== (isReceiverExist === null || isReceiverExist === void 0 ? void 0 : isReceiverExist.role))
            throw new AppError_1.default(401, "You are not authorized");
        if (!isReceiverExist)
            throw new AppError_1.default(401, "Your profile has not been found. please contact our Call center");
        if (!isReceiverExist.isVerified)
            throw new AppError_1.default(401, "You are not verified");
        if (isReceiverExist.isDeleted)
            throw new AppError_1.default(401, "Receiver is deleted");
        if (!isReceiverExist.address)
            throw new AppError_1.default(401, "Address should be updated in your profile through update user route to initialize add money");
        if (!isReceiverExist.phone)
            throw new AppError_1.default(401, "Phone number should be updated in your profile through update user route to initialize add money");
        const transactionId = (0, generateTransactionId_1.generateTransactionId)();
        const transactionType = transaction_interface_1.TRANSACTION_TYPE.ADD_MONEY;
        const transactionSource = transaction_interface_1.TRANSACTION_SOURCE.SSLCOMMERZ;
        const transactionStatus = transaction_interface_1.TRANSACTION_STATUS.PENDING;
        // const transactionFee = await calculateSendMoney();
        payload.transactionId = transactionId;
        payload.type = transactionType;
        payload.source = transactionSource;
        payload.status = transactionStatus;
        payload.receiverId = isReceiverExist._id;
        const transaction = yield transaction_model_1.Transaction.create([payload], { session });
        const amount = Number(payload.amount);
        if (isNaN(amount) || amount <= 0) {
            throw new AppError_1.default(400, "Invalid amount");
        }
        //ssl commerze integration
        const sslPayload = {
            transactionId,
            name: isReceiverExist.name,
            email: isReceiverExist.email,
            amount,
            address: isReceiverExist.address,
            phoneNumber: isReceiverExist.phone,
        };
        const sslPayment = yield sslCommerze_service_1.SSLService.sslAddMoneyInit(sslPayload);
        yield session.commitTransaction();
        session.endSession();
        console.log("from add Money\n", payload);
        return { paymeent: sslPayment.GatewayPageURL, result: transaction };
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(401, error.message);
    }
});
const addMoneySuccess = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield transaction_model_1.Transaction.startSession();
    session.startTransaction();
    try {
        //updating transaction wallet
        const updatedTransaction = yield transaction_model_1.Transaction.findOneAndUpdate({
            transactionId: query.transactionId,
        }, {
            status: transaction_interface_1.TRANSACTION_STATUS.COMPLETED,
        }, { new: true, runValidators: true, session });
        if (!updatedTransaction) {
            throw new AppError_1.default(404, "Transaction not found");
        }
        //get reciever
        const isReceiverExist = yield user_model_1.User.findById(updatedTransaction.receiverId);
        if (!isReceiverExist)
            throw new AppError_1.default(401, "User does not exist");
        //updating receiver wallet balance
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ _id: isReceiverExist.wallet }, null, { session });
        if (!receiverWallet) {
            throw new AppError_1.default(404, "Receiver wallet not found");
        }
        const newBalance = Number(receiverWallet.balance) + Number(updatedTransaction.amount);
        yield wallet_model_1.Wallet.findOneAndUpdate({
            _id: receiverWallet._id,
        }, {
            balance: newBalance,
        }, { new: true, runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment Completed successfully" };
    }
    catch (error) {
        console.log(error);
        session.abortTransaction();
        session.endSession();
    }
});
const addMoneyFail = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //updating transaction wallet
        const updatedTransaction = yield transaction_model_1.Transaction.findOneAndDelete({
            transactionId: query.transactionId,
        });
        if (!updatedTransaction) {
            throw new AppError_1.default(404, "Transaction not found");
        }
        //get reciever
        return { success: false, message: "Payment failed" };
    }
    catch (error) {
        console.log(error);
    }
});
const addMoneyCancel = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //updating transaction wallet
        const updatedTransaction = yield transaction_model_1.Transaction.findOneAndDelete({
            transactionId: query.transactionId,
        });
        if (!updatedTransaction) {
            throw new AppError_1.default(404, "Transaction not found");
        }
        //get reciever
        return { success: false, message: "Payment Cancelled" };
    }
    catch (error) {
        console.log(error);
    }
});
const sendMoney = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield transaction_model_1.Transaction.startSession();
    session.startTransaction();
    try {
        // checking sender verification
        const isSenderExist = yield user_model_1.User.findOne({ email: payload.senderEmail });
        if (decodedToken.role !== (isSenderExist === null || isSenderExist === void 0 ? void 0 : isSenderExist.role))
            throw new AppError_1.default(401, "You are not authorized");
        if (!isSenderExist)
            throw new AppError_1.default(401, "User does not exist");
        if (!isSenderExist.isVerified)
            throw new AppError_1.default(401, "Please verify your account to send money");
        if (isSenderExist.isDeleted)
            throw new AppError_1.default(401, "You are deleted");
        //checking reciever verificTION
        const isReceiverExist = yield user_model_1.User.findOne({
            email: payload.receiverEmail,
        });
        if (!isReceiverExist)
            throw new AppError_1.default(401, "Receiver does not exist");
        if (isReceiverExist.role !== user_interface_1.Role.USER)
            throw new AppError_1.default(401, "Receiver must be User");
        if (!isReceiverExist.isVerified)
            throw new AppError_1.default(401, "Receiver is not verified");
        if (isReceiverExist.isDeleted)
            throw new AppError_1.default(401, "Receiver is deleted");
        const transactionId = (0, generateTransactionId_1.generateTransactionId)();
        const transactionType = transaction_interface_1.TRANSACTION_TYPE.SEND_MONEY;
        const transactionSource = transaction_interface_1.TRANSACTION_SOURCE.USER;
        const transactionStatus = transaction_interface_1.TRANSACTION_STATUS.PENDING;
        const transactionFee = yield (0, calculateTransactionFee_1.calculateSendMoney)();
        payload.transactionId = transactionId;
        payload.type = transactionType;
        payload.source = transactionSource;
        payload.transactionFee = transactionFee;
        if (typeof transactionFee !== "number" || isNaN(transactionFee)) {
            throw new AppError_1.default(500, "Transaction fee could not be calculated");
        }
        payload.status = transactionStatus;
        payload.senderId = isSenderExist._id;
        payload.receiverId = isReceiverExist._id;
        const transaction = yield transaction_model_1.Transaction.create([payload], { session });
        const amount = Number(payload.amount);
        if (isNaN(amount) || amount <= 0) {
            throw new AppError_1.default(400, "Invalid amount");
        }
        const senderWallet = yield wallet_model_1.Wallet.findById(isSenderExist.wallet, null, {
            session,
        });
        const receiverWallet = yield wallet_model_1.Wallet.findById(isReceiverExist.wallet, null, {
            session,
        });
        if ((senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) == null) {
            throw new AppError_1.default(500, "Sender wallet not found or has no balance");
        }
        if ((receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance) == null) {
            throw new AppError_1.default(500, "Receiver wallet not found or has no balance");
        }
        //updating wallets of sender and receiver
        if ((senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) < amount + transactionFee) {
            throw new AppError_1.default(401, "Insufficient Balance");
        }
        const newWalletBalanceOfSender = (senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) - (amount + transactionFee);
        yield wallet_model_1.Wallet.findByIdAndUpdate(isSenderExist.wallet, {
            balance: newWalletBalanceOfSender,
        }, { session });
        const newWalletBalanceOfReceiver = (receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance) + amount;
        yield wallet_model_1.Wallet.findByIdAndUpdate(isReceiverExist.wallet, {
            balance: newWalletBalanceOfReceiver,
        }, { session });
        const updatedTransaction = yield transaction_model_1.Transaction.findByIdAndUpdate(transaction[0]._id, { status: transaction_interface_1.TRANSACTION_STATUS.COMPLETED }, { runValidators: true, new: true, session });
        yield session.commitTransaction();
        session.endSession();
        console.log("from add Money\n", payload);
        return updatedTransaction;
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(401, error.message);
    }
});
const cashOut = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield transaction_model_1.Transaction.startSession();
    session.startTransaction();
    try {
        // checking sender verification
        const isSenderExist = yield user_model_1.User.findOne({ email: payload.senderEmail });
        if (decodedToken.role !== (isSenderExist === null || isSenderExist === void 0 ? void 0 : isSenderExist.role))
            throw new AppError_1.default(401, "You are not authorized");
        if (!isSenderExist)
            throw new AppError_1.default(401, "User does not exist");
        if (!isSenderExist.isVerified)
            throw new AppError_1.default(401, "Please verify your account to send money");
        if (isSenderExist.isDeleted)
            throw new AppError_1.default(401, "You are deleted");
        if (isSenderExist.role !== user_interface_1.Role.USER)
            throw new AppError_1.default(401, "Sender must be a user");
        //checking reciever verificTION
        const isReceiverExist = yield user_model_1.User.findOne({
            email: payload.receiverEmail,
        });
        if (!((isReceiverExist === null || isReceiverExist === void 0 ? void 0 : isReceiverExist.role) === user_interface_1.Role.AGENT))
            throw new AppError_1.default(401, "Receiver must be an agent");
        if (!isReceiverExist)
            throw new AppError_1.default(401, "Receiver does not exist");
        if (!isReceiverExist.isVerified)
            throw new AppError_1.default(401, "Receiver is not verified");
        if (isReceiverExist.isDeleted)
            throw new AppError_1.default(401, "Receiver is deleted");
        const transactionId = (0, generateTransactionId_1.generateTransactionId)();
        const transactionType = transaction_interface_1.TRANSACTION_TYPE.CASH_OUT;
        const transactionSource = transaction_interface_1.TRANSACTION_SOURCE.USER;
        const transactionStatus = transaction_interface_1.TRANSACTION_STATUS.PENDING;
        const { sendMoneyCharge, agentCommission, systemProfit } = yield (0, calculateTransactionFee_1.calculateCashOutCharge)(payload.amount);
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
        const transaction = yield transaction_model_1.Transaction.create([payload], { session });
        const amount = Number(payload.amount);
        // if (isNaN(amount) || amount <= 0) {
        //   throw new AppError(400, "Invalid amount");
        // }
        const senderWallet = yield wallet_model_1.Wallet.findById(isSenderExist.wallet, null, {
            session,
        });
        const receiverWallet = yield wallet_model_1.Wallet.findById(isReceiverExist.wallet, null, {
            session,
        });
        if ((senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) == null) {
            throw new AppError_1.default(500, "Sender wallet not found or has no balance");
        }
        if ((receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance) == null) {
            throw new AppError_1.default(500, "Receiver wallet not found or has no balance");
        }
        //updating wallets of sender and receiver
        if ((senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) < amount + sendMoneyCharge) {
            throw new AppError_1.default(401, "Insufficient Balance");
        }
        const newWalletBalanceOfSender = (senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) - (amount + sendMoneyCharge);
        yield wallet_model_1.Wallet.findByIdAndUpdate(isSenderExist.wallet, {
            balance: newWalletBalanceOfSender,
        }, { session });
        const newWalletBalanceOfReceiver = (receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance) + amount + agentCommission;
        yield wallet_model_1.Wallet.findByIdAndUpdate(isReceiverExist.wallet, {
            balance: newWalletBalanceOfReceiver,
        }, { session });
        //updating system balance
        const system = yield system_model_1.System.findOne({}, null, { session });
        const currentSystemBalance = system === null || system === void 0 ? void 0 : system.balance;
        const newSystemBalance = currentSystemBalance + systemProfit;
        yield system_model_1.System.findByIdAndUpdate(system === null || system === void 0 ? void 0 : system._id, { balance: newSystemBalance }, { session });
        const newTransaction = yield transaction_model_1.Transaction.findByIdAndUpdate(transaction[0]._id, {
            status: transaction_interface_1.TRANSACTION_STATUS.COMPLETED,
        }, { runValidators: true, new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return newTransaction;
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(401, error);
    }
});
const cashIn = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield transaction_model_1.Transaction.startSession();
    session.startTransaction();
    try {
        // checking sender verification
        const isSenderExist = yield user_model_1.User.findOne({ email: payload.senderEmail });
        if (!isSenderExist)
            throw new AppError_1.default(401, "Sender does not exist");
        if (!((isSenderExist === null || isSenderExist === void 0 ? void 0 : isSenderExist.role) === user_interface_1.Role.AGENT))
            throw new AppError_1.default(401, "Sender must be an agent");
        if (!isSenderExist.isVerified)
            throw new AppError_1.default(401, "Please verify your account to send money");
        if (isSenderExist.isDeleted)
            throw new AppError_1.default(401, "You are deleted");
        //checking reciever verificTION
        const isReceiverExist = yield user_model_1.User.findOne({
            email: payload.receiverEmail,
        });
        if (!isReceiverExist)
            throw new AppError_1.default(401, "Receiver does not exist");
        if (!((isReceiverExist === null || isReceiverExist === void 0 ? void 0 : isReceiverExist.role) === user_interface_1.Role.USER))
            throw new AppError_1.default(401, "Receiver must be a user");
        if (!isReceiverExist.isVerified)
            throw new AppError_1.default(401, "Receiver is not verified");
        if (isReceiverExist.isDeleted)
            throw new AppError_1.default(401, "Receiver is deleted");
        const transactionId = (0, generateTransactionId_1.generateTransactionId)();
        const transactionType = transaction_interface_1.TRANSACTION_TYPE.CASH_IN;
        const transactionSource = transaction_interface_1.TRANSACTION_SOURCE.AGENT;
        const transactionStatus = transaction_interface_1.TRANSACTION_STATUS.PENDING;
        const transactionFee = yield (0, calculateTransactionFee_1.calculateCashInCharge)();
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
        const transaction = yield transaction_model_1.Transaction.create([payload], { session });
        const amount = Number(payload.amount);
        // if (isNaN(amount) || amount <= 0) {
        //   throw new AppError(400, "Invalid amount");
        // }
        const senderWallet = yield wallet_model_1.Wallet.findById(isSenderExist.wallet, null, {
            session,
        });
        const receiverWallet = yield wallet_model_1.Wallet.findById(isReceiverExist.wallet, null, {
            session,
        });
        if ((senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) == null) {
            throw new AppError_1.default(500, "Sender wallet not found or has no balance");
        }
        if ((receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance) == null) {
            throw new AppError_1.default(500, "Receiver wallet not found or has no balance");
        }
        //updating wallets of sender and receiver
        if ((senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) < amount + transactionFee) {
            throw new AppError_1.default(401, "Insufficient Balance");
        }
        const newWalletBalanceOfSender = (senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) - (amount + transactionFee);
        yield wallet_model_1.Wallet.findByIdAndUpdate(isSenderExist.wallet, {
            balance: newWalletBalanceOfSender,
        }, { session });
        const newWalletBalanceOfReceiver = (receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.balance) + amount;
        yield wallet_model_1.Wallet.findByIdAndUpdate(isReceiverExist.wallet, {
            balance: newWalletBalanceOfReceiver,
        }, { session });
        //updating system balance
        // const system = await System.findOne({}, null, { session });
        // const currentSystemBalance = system?.balance as number;
        // const newSystemBalance = currentSystemBalance + systemProfit;
        // await System.findByIdAndUpdate(
        //   system?._id,
        //   { balance: newSystemBalance },
        //   { session }
        // );
        const newTransaction = yield transaction_model_1.Transaction.findByIdAndUpdate(transaction[0]._id, {
            status: transaction_interface_1.TRANSACTION_STATUS.COMPLETED,
        }, { runValidators: true, new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return newTransaction;
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(401, error.message);
    }
});
const getAllTransaction = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const modelQuery = new QueryBuilder_1.QueryBuilder(transaction_model_1.Transaction.find()
        .populate("senderId", "name email role isActive")
        .populate("receiverId", "name email role isActive"), query);
    const transactions = modelQuery
        .search(constants_1.searchableFields)
        .filter()
        .sort()
        .fields()
        .pagination();
    const [data, meta] = yield Promise.all([
        transactions.build(),
        transactions.getMeta(),
    ]);
    return { data, meta };
});
const getMyTransactions = (decodedToken, query) => __awaiter(void 0, void 0, void 0, function* () {
    const myId = decodedToken.userId;
    const isMyDataExist = yield user_model_1.User.findById(myId);
    if (!isMyDataExist)
        throw new AppError_1.default(401, "Your Data is not found. Please contact our support team.");
    const isVerified = isMyDataExist.role === decodedToken.role;
    if (!isVerified)
        throw new AppError_1.default(401, "User is not verified");
    // const myTransactions=await Transaction.
    const modelQuery = new QueryBuilder_1.QueryBuilder(transaction_model_1.Transaction.find({
        $or: [{ senderId: myId }, { receiverId: myId }],
    })
        .populate("senderId", "name email role isActive")
        .populate("receiverId", "name email role isActive"), query);
    const myTransactions = modelQuery
        .dateFiltering()
        .search(constants_1.searchableFields)
        .sort()
        .fields()
        .pagination();
    const [data, meta] = yield Promise.all([
        myTransactions.build(),
        myTransactions.getMeta(),
    ]);
    return { data, meta };
});
exports.TransactionService = {
    addMoney,
    addMoneySuccess,
    addMoneyFail,
    addMoneyCancel,
    sendMoney,
    cashOut,
    cashIn,
    getAllTransaction,
    getMyTransactions,
};
