"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoiceId = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generates a unique and readable invoice ID.
 * Example output: INV-20251028-3F7C9A
 */
const generateInvoiceId = () => {
    const date = new Date();
    const datePart = date
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, ""); // e.g. 20251028
    const randomPart = crypto_1.default.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
    return `INV-${datePart}-${randomPart}`;
};
exports.generateInvoiceId = generateInvoiceId;
