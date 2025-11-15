"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string("Name is required")
        .min(2, "Name should be at least minimum of two characters")
        .max(50, "Name should be maximum of 50 characters"),
    email: zod_1.default
        .email("Invalid Email Format")
        .min(2, "Email should be at least minimum of two characters")
        .max(50, "Email should be maximum of 50 characters"),
    password: zod_1.default
        .string("Password Must be string")
        .min(6, "Password must includes at least 6 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .optional(),
    phone: zod_1.default
        .string("Phone number must be a string")
        .regex(/^(\+8801[3-9][0-9]{8}|01[3-9][0-9]{8})$/, "Invalid Bangladeshi phone number format")
        .optional(),
    profilePhoto: zod_1.default.string("Photo must be string").optional(),
    address: zod_1.default
        .string("Address must be string")
        .max(200, {
        message: "Address can not exceed more than 200 characters",
    })
        .optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string("Name is required")
        .min(2, "Name should be at least minimum of two characters")
        .max(50, "Name should be maximum of 50 characters")
        .optional(),
    phone: zod_1.default
        .string("Phone number must be a string")
        .regex(/^(\+8801[3-9][0-9]{8}|01[3-9][0-9]{8})$/, "Invalid Bangladeshi phone number format")
        .optional(),
    profilePicture: zod_1.default.string("Photo link must be string").optional(),
    address: zod_1.default
        .string("Address must be string")
        .max(200, {
        message: "Address can not exceed more than 200 characters",
    })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    isDeleted: zod_1.default.boolean("isDeleted Must be true or false.").optional(),
    isVerified: zod_1.default.boolean("isVerified Must be true or false.").optional(),
    agentRequestStatus: zod_1.default.enum(Object.values(user_interface_1.AgentRequestStatus)).optional(),
    agentRequestedAt: zod_1.default.date().optional(),
    agentApprovedAt: zod_1.default.date().optional(),
});
