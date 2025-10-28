/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";
import path from 'path'




export interface IInvoiceData {
  invoiceId: string;
  transactionId: string;
  transactionDate: Date;
  senderName: string;
  senderEmail?: string;
  receiverName: string;
  receiverEmail: string;
  transactionType: string; // e.g. "Wallet Transfer", "Bill Payment", "Deposit"
  totalAmount: number;
  status: string; // e.g. "Completed", "Pending", "Failed"
  notes?: string;
}
const logoPath = path.join(__dirname, "../../assets/logo.png");

export const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk: Uint8Array<ArrayBufferLike>) => buffer.push(chunk));
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
      } catch {
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
      } else {
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
  } catch (error: any) {
    console.log(error);
    throw new AppError(401, `pdf creation error: ${error.message}`);
  }
};
