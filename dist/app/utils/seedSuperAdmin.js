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
exports.seedSuperAdmin = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const wallet_model_1 = require("../modules/wallet/wallet.model");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
        });
        if (isSuperAdminExist) {
            console.log("Super admin exist");
            return;
        }
        console.log("Trying to create super admin");
        const hashedPassword = yield bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const authProvider = {
            provider: "credentials",
            providerId: env_1.envVars.SUPER_ADMIN_EMAIL,
        };
        const payload = {
            name: "super-admin",
            role: user_interface_1.Role.SUPER_ADMIN,
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider],
        };
        const userDoc = new user_model_1.User(payload);
        const superAdmin = yield userDoc.save({ session });
        const superWallet = yield wallet_model_1.Wallet.create([{ user: superAdmin._id }], {
            session,
        });
        superAdmin.wallet = superWallet[0]._id;
        yield superAdmin.save({ session });
        console.log(`SuperAdmin Created successfully with data \n
      super Admin: ${superAdmin} \n
      super wallet: ${superWallet}`);
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(401, `Error in creating super admin :${error.message}`);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
