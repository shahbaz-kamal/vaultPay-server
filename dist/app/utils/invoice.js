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
exports.generatePdf = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const path_1 = __importDefault(require("path"));
const logoPath = path_1.default.join(__dirname, "../../app/assets/logo.png");
const generatePdf = (invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffer = [];
            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));
            // ======================
            // HEADER SECTION
            // ======================
            try {
                doc.image(logoPath, 50, 40, {
                    width: 40,
                    height: 40,
                });
            }
            catch (_a) {
                doc.fontSize(20).text("VaultPay", 50, 50);
            }
            doc.fontSize(22).fillColor("#007bff").text("INVOICE", 400, 45, { align: "right" });
            doc
                .fontSize(10)
                .fillColor("#333")
                .text(`Invoice ID: ${invoiceData.invoiceId}`, 400, 70, { align: "right" })
                .text(`Date: ${new Date(invoiceData.transactionDate).toLocaleDateString()}`, { align: "right" });
            doc.moveDown(3);
            // ======================
            // COMPANY INFO
            // ======================
            doc.fontSize(11).fillColor("#555").text("VaultPay", 50, 110).text("support@vaultpay.com").text("www.vaultpay.com").moveDown(2);
            // ======================
            // TRANSACTION DETAILS
            // ======================
            doc.fontSize(14).fillColor("#007bff").text("Transaction Summary", { underline: true }).moveDown(1);
            const details = [
                { label: "Invoice ID", value: invoiceData.invoiceId },
                { label: "Transaction ID", value: invoiceData.transactionId },
                { label: "Transaction Type", value: invoiceData.transactionType },
                {
                    label: "Transaction Date",
                    value: new Date(invoiceData.transactionDate).toLocaleString(),
                },
                { label: "Total Amount", value: invoiceData.totalAmount.toFixed(2) },
                { label: "Status", value: invoiceData.status },
            ];
            details.forEach((item) => {
                doc.fontSize(11).fillColor("#333").text(`${item.label}:`, { continued: true }).fillColor("#000").text(` ${item.value}`);
            });
            doc.moveDown(2);
            // ======================
            // SENDER & RECEIVER
            // ======================
            doc.fontSize(14).fillColor("#007bff").text("Participants", { underline: true }).moveDown(1);
            if (invoiceData.senderName) {
                doc
                    .fontSize(11)
                    .fillColor("#111")
                    .text("Sender Details:", 50)
                    .fillColor("#333")
                    .text(`Name: ${invoiceData.senderName}`)
                    .text(`Email: ${invoiceData.senderEmail}`)
                    .moveDown(1);
            }
            else {
                doc
                    .fontSize(11)
                    .fillColor("#111")
                    .text("Sender Details:", 50)
                    .fillColor("#333")
                    .text(`Name: ${invoiceData.senderName}`)
                    .moveDown(1);
            }
            doc
                .fontSize(11)
                .fillColor("#111")
                .text("Receiver Details:", 50)
                .fillColor("#333")
                .text(`Name: ${invoiceData.receiverName}`)
                .text(`Email: ${invoiceData.receiverEmail}`)
                .moveDown(1);
            if (invoiceData.notes) {
                doc.moveDown(1).fontSize(11).fillColor("#111").text("Note:", 50).fillColor("#333").text(invoiceData.notes).moveDown(1);
            }
            // ======================
            // FOOTER
            // ======================
            doc.moveDown(4);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#ccc").stroke();
            doc.moveDown(1);
            doc
                .fontSize(10)
                .fillColor("#777")
                .text("Thank you for using VaultPay.", { align: "center" })
                .text("Secure • Fast • Reliable", { align: "center" });
            // END PDF
            doc.end();
        });
    }
    catch (error) {
        console.log(error);
        throw new AppError_1.default(401, `pdf creation error: ${error.message}`);
    }
});
exports.generatePdf = generatePdf;
