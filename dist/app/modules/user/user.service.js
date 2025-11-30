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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const constants_1 = require("../../constants");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const wallet_model_1 = require("../wallet/wallet.model");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = yield user_model_1.User.create([
        Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest),
    ], { session });
    const wallet = yield wallet_model_1.Wallet.create([
        {
            user: user[0]._id,
        },
    ], { session });
    user[0].wallet = wallet[0]._id;
    yield user[0].save({ session });
    yield session.commitTransaction();
    session.endSession();
    return { user, wallet };
});
//const users =new QueryBuilder(User.find(),query)
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const modelQuery = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const users = modelQuery.search(constants_1.searchableFields).filter().sort().fields().pagination();
    const [data, meta] = yield Promise.all([users.build(), users.getMeta()]);
    return { data, meta };
});
// const getAllUser = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query?.fields?.split(",").join(" ") || "";
//   const page = Number(query.page) || 1;
//   const limit = Number(query?.limit) || 10;
//   const skip = (page - 1) * limit;
//   for (const field of excludedFields) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }
//   const searchQuery = {
//     $or: searchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };
//   const filterQuery = User.find(filter).find(searchQuery);
//   const user = await filterQuery
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);
//   const totalDocuments = await User.countDocuments();
//   const totalPage = Math.ceil(user.length / limit);
//   const meta: TMeta = {
//     totalDocuments,
//     noOfMatchedDocuments: user.length,
//     page,
//     totalPage,
//     limit,
//   };
//   return { data: user, meta };
// };
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    return { data: user };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT)
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        if (payload.role === user_interface_1.Role.SUPER_ADMIN && decodedToken.role === user_interface_1.Role.ADMIN)
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        if (payload.isActive || payload.isDeleted || payload.isVerified) {
            if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
            }
        }
    }
    if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
        if (userId !== decodedToken.userId)
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        if (isUserExist.auths.length) {
            const isCredentialsExist = isUserExist.auths.find((auth) => auth.provider === "credentials");
            if (!isCredentialsExist) {
                const newAuth = {
                    provider: "credentials",
                    providerId: isUserExist.email,
                };
                isUserExist.auths.push(newAuth);
                yield isUserExist.save();
            }
        }
        // check if the user is updating their own profile
        const isSelfUpdate = decodedToken.userId === userId;
        const requesterRole = decodedToken.role;
        if (payload.agentRequestStatus) {
            if (payload.agentRequestStatus !== user_interface_1.AgentRequestStatus.PENDING && isSelfUpdate && requesterRole === user_interface_1.Role.USER)
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
        if (payload.agentApprovedAt && requesterRole === user_interface_1.Role.USER)
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    if (payload.profilePicture && isUserExist.profilePicture)
        yield (0, cloudinary_config_1.deleteFromCloudinary)(isUserExist.profilePicture);
    return newUpdatedUser;
});
const getMe = (myId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(myId).select("-password").populate({ path: "wallet" });
    return {
        data: user,
    };
});
exports.UserServices = {
    createUser,
    getAllUser,
    updateUser,
    getSingleUser,
    getMe,
};
