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
exports.TransactionController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const transaction_service_1 = require("./transaction.service");
const env_1 = require("../../config/env");
const addMoney = (0, catchAsync_1.catchAsync)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield transaction_service_1.TransactionService.addMoney(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Add Money Successfull",
        data: result,
    });
}));
const addMoneySuccess = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield transaction_service_1.TransactionService.addMoneySuccess(query);
    if (result === null || result === void 0 ? void 0 : result.success) {
        res.redirect(`${env_1.envVars.SSL.SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
    // sendResponse(res, {
    //   statusCode: httpStatus.CREATED,
    //   success: true,
    //   message: "Add Money Successfull",
    //   data: result,
    // });
}));
const addMoneyFail = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield transaction_service_1.TransactionService.addMoneyFail(query);
    if ((result === null || result === void 0 ? void 0 : result.success) === false) {
        res.redirect(`${env_1.envVars.SSL.FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
const addMoneyCancel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield transaction_service_1.TransactionService.addMoneyFail(query);
    if ((result === null || result === void 0 ? void 0 : result.success) === false) {
        res.redirect(`${env_1.envVars.SSL.FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
const sendMoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const sendMoney = yield transaction_service_1.TransactionService.sendMoney(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Send Money Successfull",
        data: sendMoney,
    });
}));
const cashOut = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const cashOut = yield transaction_service_1.TransactionService.cashOut(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Cash out Successfull",
        data: cashOut,
    });
}));
const cashIn = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cashIn = yield transaction_service_1.TransactionService.cashIn(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Cash In Successfull",
        data: cashIn,
    });
}));
const getAllTransaction = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //   throw new AppError(httpStatus.BAD_REQUEST,"ssssss")
    const query = req.query;
    const result = yield transaction_service_1.TransactionService.getAllTransaction(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Transaction data retrieved successfully",
        statusCode: http_status_codes_1.default.OK,
        data: result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
}));
const getMyTransactions = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const query = req.query;
    const result = yield transaction_service_1.TransactionService.getMyTransactions(decodedToken, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Your Transaction data has been received",
        data: result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
}));
exports.TransactionController = {
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
