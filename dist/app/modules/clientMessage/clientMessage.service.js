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
exports.CLientMessageService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const clientMessage_model_1 = require("./clientMessage.model");
const storeClientMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield clientMessage_model_1.ClientMessage.create(payload);
    return res;
});
const getClientMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    const clientMessages = yield clientMessage_model_1.ClientMessage.find();
    return clientMessages;
});
const updateClientMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    const isExist = yield clientMessage_model_1.ClientMessage.findOne({ _id: id });
    if (!isExist)
        throw new AppError_1.default(401, "Client Message not found");
    isExist.isRead = true;
    isExist.save();
});
exports.CLientMessageService = { storeClientMessage, getClientMessage, updateClientMessage };
