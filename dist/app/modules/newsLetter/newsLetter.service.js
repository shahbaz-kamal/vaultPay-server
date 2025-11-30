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
exports.NewsLetterService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const newsLetter_model_1 = require("./newsLetter.model");
const storeNewsLetterSubscription = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isEmailExist = yield newsLetter_model_1.NewsLetter.findOne({ email: payload.email });
    if (isEmailExist)
        throw new AppError_1.default(400, "You are already subscribed to our newsletter");
    const res = yield newsLetter_model_1.NewsLetter.create(payload);
    return res;
});
const getNewsLetter = () => __awaiter(void 0, void 0, void 0, function* () {
    const newsLetter = yield newsLetter_model_1.NewsLetter.find();
    return newsLetter;
});
exports.NewsLetterService = { storeNewsLetterSubscription, getNewsLetter };
