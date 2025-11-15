"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("../transaction/transaction.interface");
const systemChargesSchema = new mongoose_1.Schema({
    type: { type: String, enum: Object.values(transaction_interface_1.TRANSACTION_TYPE) },
    charge: { type: Number },
    perAmountTransaction: { type: Number, default: null },
    agentCommission: { type: Number, default: null },
}, { _id: false, versionKey: false, timestamps: false });
const systemSchema = new mongoose_1.Schema({
    balance: { type: Number, required: true, default: 0 },
    systemCharges: { type: [systemChargesSchema] },
    agentComimissionPayout: { type: Number, default: null },
}, { versionKey: false, timestamps: true });
exports.System = (0, mongoose_1.model)("System", systemSchema);
