"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMoneyZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.sendMoneyZodSchema = zod_1.default.object({
    // transactionId:z.string("TransactionId is required"),
    // type:z.enum(Object.values(TRANSACTION_TYPE.SEND_MONEY),"Transaction Type is required").optional(),
    // source:z.enum(Object.values(TRANSACTION_SOURCE.USER),"Transaction Type is required").optional(),
    senderEmail: zod_1.default.email("Sender Must be Email").optional(),
    receiverEmail: zod_1.default.email(" Reciever must be Email"),
    amount: zod_1.default.number("Amount must be number"),
    notes: zod_1.default.string("Notes must be string"),
});
