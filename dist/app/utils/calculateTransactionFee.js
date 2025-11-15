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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCashInCharge = exports.calculateCashOutCharge = exports.calculateSendMoney = void 0;
const system_model_1 = require("../modules/system/system.model");
const transaction_interface_1 = require("../modules/transaction/transaction.interface");
const calculateSendMoney = () => __awaiter(void 0, void 0, void 0, function* () {
    const system = yield system_model_1.System.find();
    const sendMoneyData = system[0].systemCharges.filter((singleType) => singleType.type === transaction_interface_1.TRANSACTION_TYPE.SEND_MONEY);
    const sendMoneyCharge = sendMoneyData[0].charge;
    // console.log(sendMoneyCharge, "send money charge");
    return sendMoneyCharge;
});
exports.calculateSendMoney = calculateSendMoney;
const calculateCashOutCharge = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const system = yield system_model_1.System.find();
    const cashOutData = system[0].systemCharges.filter((singleType) => singleType.type === transaction_interface_1.TRANSACTION_TYPE.CASH_OUT);
    const informationObject = cashOutData[0];
    const cashOutCharge = (informationObject.charge /
        Number(informationObject.perAmountTransaction)) *
        amount;
    const agentCommission = (Number(informationObject.agentCommission) /
        Number(informationObject.perAmountTransaction)) *
        amount;
    const systemProfit = cashOutCharge - agentCommission;
    return { cashOutCharge, agentCommission, systemProfit };
});
exports.calculateCashOutCharge = calculateCashOutCharge;
const calculateCashInCharge = () => __awaiter(void 0, void 0, void 0, function* () {
    const system = yield system_model_1.System.find();
    const cashInData = system[0].systemCharges.filter((singleType) => singleType.type === transaction_interface_1.TRANSACTION_TYPE.CASH_IN);
    const informationObject = cashInData[0];
    const cashInCharge = informationObject.charge;
    return cashInCharge;
});
exports.calculateCashInCharge = calculateCashInCharge;
