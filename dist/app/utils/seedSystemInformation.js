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
exports.seedSystemInformation = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const system_model_1 = require("../modules/system/system.model");
const transaction_interface_1 = require("../modules/transaction/transaction.interface");
const seedSystemInformation = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSystemInformationExist = yield system_model_1.System.findOne({});
        if (isSystemInformationExist) {
            console.log("System information exist");
            return;
        }
        console.log("Trying to create super admin");
        const payload = {
            balance: 0,
            systemCharges: [
                {
                    type: transaction_interface_1.TRANSACTION_TYPE.CASH_IN,
                    charge: 0,
                    perAmountTransaction: 1000,
                },
                {
                    type: transaction_interface_1.TRANSACTION_TYPE.CASH_OUT,
                    charge: 20,
                    agentCommission: 14,
                    perAmountTransaction: 1000,
                },
                {
                    type: transaction_interface_1.TRANSACTION_TYPE.SEND_MONEY,
                    charge: 5,
                },
            ],
        };
        const systemData = yield new system_model_1.System(payload).save();
        // const userDoc = new User(payload);
        // const superAdmin = await userDoc.save({ session });
        // const superWallet = await Wallet.create([{ user: superAdmin._id }], {
        //   session,
        // });
        console.log(`SystemData Created successfully with data \n
     ${systemData}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        console.log(error);
        throw new AppError_1.default(401, `Error in creating super admin :${error.message}`);
    }
});
exports.seedSystemInformation = seedSystemInformation;
