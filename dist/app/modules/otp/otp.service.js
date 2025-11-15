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
exports.OTPService = void 0;
const env_1 = require("../../config/env");
const redis_config_1 = require("../../config/redis.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const generateOtp_1 = require("../../utils/generateOtp");
const sendEmail_1 = require("../../utils/sendEmail");
const user_model_1 = require("../user/user.model");
const sendOTP = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new AppError_1.default(401, "User does not exist");
    if (user.isVerified)
        throw new AppError_1.default(401, "User is already verified");
    const otp = (0, generateOtp_1.generateOtp)();
    const redisKey = `otp:${email}`;
    const otpExpirationTime = Number(env_1.envVars.REDIS.OTP_EXPIRATION_TIME);
    yield redis_config_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: otpExpirationTime,
        },
    });
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp,
            otpExpirationTime: Math.floor(otpExpirationTime / 60),
        },
    });
});
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new AppError_1.default(401, "User does not exist");
    if (user.isVerified)
        throw new AppError_1.default(401, "User is already verified");
    const redisKey = `otp:${email}`;
    const savedOtp = yield redis_config_1.redisClient.get(redisKey);
    if (!savedOtp)
        throw new AppError_1.default(401, "Invalid OTP");
    if (savedOtp !== otp)
        throw new AppError_1.default(401, "Invalid OTP");
    yield Promise.all([user_model_1.User.updateOne({ email }, { isVerified: true }, { runValidators: true }), redis_config_1.redisClient.del(redisKey)]);
});
exports.OTPService = { sendOTP, verifyOTP };
