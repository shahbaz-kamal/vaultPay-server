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
exports.handleInvoiceSendAndUpload = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const cloudinary_config_1 = require("../config/cloudinary.config");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const invoice_1 = require("./invoice");
const sendEmail_1 = require("./sendEmail");
const handleInvoiceSendAndUpload = (invoiceData_1, ...args_1) => __awaiter(void 0, [invoiceData_1, ...args_1], void 0, function* (invoiceData, numberOfEmailRecipients = 1) {
    try {
        const pdfBuffer = yield (0, invoice_1.generatePdf)(invoiceData);
        const cloudinaryResult = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, `invoice-${invoiceData.invoiceId}`);
        // console.log("cloudinary result:", cloudinaryResult);
        const emailRecievers = [];
        //   if transactions is made by user to user, send email to both sender and receiver
        emailRecievers.push(invoiceData.receiverEmail);
        if (numberOfEmailRecipients === 2 && invoiceData.senderEmail)
            emailRecievers.push(invoiceData.senderEmail);
        emailRecievers.forEach((email) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, sendEmail_1.sendEmail)({
                to: email,
                subject: "Your Transaction Invoice",
                templateName: "invoice",
                templateData: invoiceData,
                attachments: [
                    {
                        fileName: "invoice.pdf",
                        content: pdfBuffer,
                        contentType: "application/pdf",
                    },
                ],
            });
        }));
        return { success: true, invoiceUrl: cloudinaryResult.secure_url };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        throw new AppError_1.default(500, "Invoice generation failed");
    }
});
exports.handleInvoiceSendAndUpload = handleInvoiceSendAndUpload;
