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
exports.WalletController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const wallet_service_1 = require("./wallet.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const http_status_codes_2 = __importDefault(require("http-status-codes"));
const getAllWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //   throw new AppError(httpStatus.BAD_REQUEST,"ssssss")
    const query = req.query;
    const result = yield wallet_service_1.WalletServices.getAllWallet(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Wallet data retrieved successfully",
        statusCode: http_status_codes_1.default.OK,
        data: result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
}));
const updateWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const walletId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const wallet = yield wallet_service_1.WalletServices.updateWallet(walletId, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_2.default.CREATED,
        message: "user Updated successfully",
        data: wallet,
    });
}));
exports.WalletController = { getAllWallet, updateWallet };
