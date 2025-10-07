"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("../user/user.interface");
exports.updateWalletZodSchema = zod_1.default.object({
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)),
});
