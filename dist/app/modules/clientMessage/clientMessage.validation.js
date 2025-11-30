"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientMessageZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.clientMessageZodSchema = zod_1.default.object({
    name: zod_1.default
        .string("Name is required")
        .min(2, "Name should be at least minimum of two characters")
        .max(50, "Name should be maximum of 50 characters"),
    email: zod_1.default
        .email("Invalid Email Format")
        .min(2, "Email should be at least minimum of two characters")
        .max(50, "Email should be maximum of 50 characters"),
    subject: zod_1.default.string("Subject Must be String").max(300, "Subject can not exceed more than 300 characters").optional(),
    message: zod_1.default
        .string("Message is required")
        .min(10, "Message should be at least minimum of ten characters")
        .max(2000, "Message can not exceed more than 1000 characters"),
    isRead: zod_1.default.boolean("isRead Must be true or false.").optional(),
});
