"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateTransactionId = () => {
    const timestamp = Date.now(); // milliseconds
    const random = crypto_1.default.randomBytes(6).toString("hex"); // 12-char random string
    return `trans_${timestamp}_${random}`;
};
exports.generateTransactionId = generateTransactionId;
