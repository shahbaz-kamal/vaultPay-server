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
exports.WalletServices = void 0;
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const wallet_model_1 = require("./wallet.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const getAllWallet = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const modelQuery = new QueryBuilder_1.QueryBuilder(wallet_model_1.Wallet.find().populate("user", "name email role isActive"), query);
    const wallets = modelQuery.filter().sort().fields().pagination();
    const [data, meta] = yield Promise.all([wallets.build(), wallets.getMeta()]);
    return { data, meta };
});
const updateWallet = (walletId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isWalletExist = yield wallet_model_1.Wallet.findById(walletId);
    if (!isWalletExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet Not Found");
    }
    const isUserExist = yield user_model_1.User.findById(isWalletExist.user);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet Not Found");
    }
    if (isUserExist.role === user_interface_1.Role.SUPER_ADMIN && decodedToken.role === user_interface_1.Role.ADMIN)
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    const walletStatus = payload.isActive;
    const updatedWallet = yield wallet_model_1.Wallet.findByIdAndUpdate(walletId, {
        isActive: walletStatus,
    }, { new: true, runValidators: true });
    return updatedWallet;
});
exports.WalletServices = { getAllWallet, updateWallet };
