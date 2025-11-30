"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMessage = void 0;
const mongoose_1 = require("mongoose");
const clientMessageSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: null },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
exports.ClientMessage = (0, mongoose_1.model)("ClienMessage", clientMessageSchema);
