"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeNewsLetterZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.storeNewsLetterZodSchema = zod_1.default.object({
    email: zod_1.default
        .email("Invalid Email Format")
        .min(2, "Email should be at least minimum of two characters")
        .max(50, "Email should be maximum of 50 characters"),
});
